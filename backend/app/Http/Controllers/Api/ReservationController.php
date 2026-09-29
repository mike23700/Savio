<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espace;
use App\Models\Reservation;
use App\Payments\PaymentService;
use App\Services\EspaceAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Bookings of a room (welcome centre) or a hall. Guests can book without an
 * account, like shop orders. When the space has a price the booking is paid
 * through PaymentService (mobile money via Peex, or cash at the secretariat);
 * otherwise it is a request the secretariat answers with a quote.
 */
class ReservationController extends Controller
{
    private const MAX_NIGHTS = 30;

    private const MAX_HALL_DAYS = 7;

    public function store(Request $request, PaymentService $payments, EspaceAvailability $availability)
    {
        $data = $request->validate([
            'espace_id' => 'required|integer',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            // "yesterday" leaves room for visitors whose timezone is behind the server's
            'date_debut' => 'required|date_format:Y-m-d|after_or_equal:yesterday',
            'date_fin' => 'required|date_format:Y-m-d',
            'nb_unites' => 'nullable|integer|min:1|max:50',
            'nb_personnes' => 'nullable|integer|min:1|max:5000',
            'evenement' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'payment_method' => 'nullable|in:orange_money,mtn_momo,especes',
        ]);

        $reservation = DB::transaction(function () use ($data, $request, $availability) {
            // Lock the space so two visitors cannot grab its last unit at the same time.
            $espace = Espace::whereKey($data['espace_id'])->where('is_active', true)->lockForUpdate()->first();
            if (! $espace) {
                throw ValidationException::withMessages(['espace_id' => ['Cet espace n\'est pas disponible à la réservation.']]);
            }

            $debut = Carbon::parse($data['date_debut']);
            $fin = Carbon::parse($data['date_fin']);
            $units = (int) ($data['nb_unites'] ?? 1);
            $duration = EspaceAvailability::duration($espace, $debut, $fin);

            $this->checkDuration($espace, $duration);
            if ($espace->capacite && ! empty($data['nb_personnes']) && $data['nb_personnes'] > $espace->capacite * $units) {
                throw ValidationException::withMessages([
                    'nb_personnes' => ["Capacité maximale : {$espace->capacite} personne(s)" . ($espace->isChambre() ? ' par chambre.' : '.')],
                ]);
            }
            if ($espace->hasPrice() && empty($data['payment_method'])) {
                throw ValidationException::withMessages(['payment_method' => ['Choisissez un moyen de paiement.']]);
            }

            $left = $availability->unitsLeft($espace, $debut, $fin);
            if ($left < $units) {
                throw ValidationException::withMessages([
                    'date_debut' => [$left > 0
                        ? "Il ne reste que {$left} unité(s) disponible(s) sur ces dates."
                        : 'Ces dates ne sont plus disponibles. Merci d\'en choisir d\'autres.'],
                ]);
            }

            return Reservation::create([
                'reference' => 'RES-' . now()->format('ymd') . '-' . Str::upper(Str::random(5)),
                'espace_id' => $espace->id,
                'user_id' => $request->user('sanctum')?->id,
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'] ?? null,
                'telephone' => $data['telephone'],
                'date_debut' => $debut->toDateString(),
                'date_fin' => $fin->toDateString(),
                'nb_unites' => $units,
                'nb_personnes' => $data['nb_personnes'] ?? null,
                'evenement' => $data['evenement'] ?? null,
                'message' => $data['message'] ?? null,
                'montant' => $espace->hasPrice() ? $espace->prix * $duration * $units : null,
                'payment_method' => $espace->hasPrice() ? $data['payment_method'] : null,
            ]);
        });

        $payment = $reservation->montant ? $payments->start($reservation) : null;

        return response()->json([
            'reservation' => $reservation->fresh('espace:id,nom,kind,slug'),
            'payment' => $payment,
        ], 201);
    }

    public function myReservations(Request $request)
    {
        return response()->json(
            Reservation::where('user_id', $request->user()->id)->with('espace:id,nom,kind,slug')->latest()->get()
        );
    }

    public function adminIndex(Request $request)
    {
        $request->validate(['kind' => 'nullable|in:chambre,salle']);

        return response()->json(
            Reservation::with('espace:id,nom,kind')
                ->when($request->query('kind'), fn ($q, $kind) => $q->whereHas('espace', fn ($e) => $e->where('kind', $kind)))
                ->latest()
                ->get()
        );
    }

    public function update(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'statut' => 'nullable|in:en_attente,confirmee,terminee,annulee',
            'payment_status' => 'nullable|in:en_attente,paye,echoue,annule',
            'montant' => 'nullable|numeric|min:0',
            'admin_notes' => 'nullable|string',
        ]);
        $data = array_filter($data, fn ($v, $k) => $v !== null || $k === 'admin_notes', ARRAY_FILTER_USE_BOTH);

        if (($data['payment_status'] ?? null) === 'paye' && $reservation->payment_status !== 'paye') {
            $data['confirmed_by_user_id'] = $request->user()->id;
            $data['confirmed_at'] = now();
            if ($reservation->statut === 'en_attente' && ! isset($data['statut'])) {
                $data['statut'] = 'confirmee';
            }
        }

        $reservation->update($data);

        return response()->json($reservation->fresh('espace:id,nom,kind'));
    }

    private function checkDuration(Espace $espace, int $duration): void
    {
        if ($espace->isChambre()) {
            if ($duration < 1) {
                throw ValidationException::withMessages(['date_fin' => ['La date de départ doit être après la date d\'arrivée.']]);
            }
            if ($duration > self::MAX_NIGHTS) {
                throw ValidationException::withMessages(['date_fin' => ['Séjour limité à ' . self::MAX_NIGHTS . ' nuits en ligne : contactez le secrétariat pour un séjour plus long.']]);
            }

            return;
        }

        if ($duration < 1) {
            throw ValidationException::withMessages(['date_fin' => ['La date de fin ne peut pas précéder la date de début.']]);
        }
        if ($duration > self::MAX_HALL_DAYS) {
            throw ValidationException::withMessages(['date_fin' => ['Location limitée à ' . self::MAX_HALL_DAYS . ' jours en ligne : contactez le secrétariat.']]);
        }
    }
}
