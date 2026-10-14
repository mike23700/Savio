<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistreInscription;
use App\Models\RegistrePrintRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * A member asks the parish office to print their register fiche as an A4 PDF.
 * The admin lists the requests, generates the PDF and marks the request as
 * handled once it has been printed/sent.
 */
class RegistrePrintRequestController extends Controller
{
    /** Statuses that still count as an open request. */
    private const OPEN_STATUTS = ['en_attente', 'en_traitement', 'prete'];

    public function store(Request $request)
    {
        $data = $request->validate([
            'message' => 'nullable|string|max:2000',
        ]);

        $inscription = RegistreInscription::where('user_id', $request->user()->id)->latest()->first();
        if (! $inscription) {
            return response()->json([
                'message' => "Vous devez d'abord vous inscrire au registre paroissial.",
            ], 422);
        }

        $existing = RegistrePrintRequest::where('registre_inscription_id', $inscription->id)
            ->whereIn('statut', self::OPEN_STATUTS)
            ->latest()
            ->first();
        if ($existing) {
            return response()->json([
                'message' => 'Une demande d\'impression est déjà en cours pour votre fiche.',
                'request' => $existing,
            ], 422);
        }

        $printRequest = RegistrePrintRequest::create([
            'reference' => 'IMP-'.now()->format('ymd').'-'.Str::upper(Str::random(5)),
            'registre_inscription_id' => $inscription->id,
            'user_id' => $request->user()->id,
            'statut' => 'en_attente',
            'message' => $data['message'] ?? null,
        ]);

        return response()->json($printRequest->load('inscription:id,nom,prenom'), 201);
    }

    public function myRequests(Request $request)
    {
        return response()->json(
            RegistrePrintRequest::where('user_id', $request->user()->id)->latest()->get()
        );
    }

    public function adminIndex(Request $request)
    {
        $request->validate(['statut' => 'nullable|in:'.implode(',', RegistrePrintRequest::STATUTS)]);

        return response()->json(
            RegistrePrintRequest::with([
                'inscription' => fn ($q) => $q->with('sacrements'),
                'user:id,nom,prenom,email',
            ])
                ->when($request->query('statut'), fn ($q, $statut) => $q->where('statut', $statut))
                ->latest()
                ->get()
        );
    }

    public function update(Request $request, RegistrePrintRequest $registrePrintRequest)
    {
        $data = $request->validate([
            'statut' => 'nullable|in:'.implode(',', RegistrePrintRequest::STATUTS),
            'admin_notes' => 'nullable|string',
        ]);

        if (($data['statut'] ?? null) !== null && in_array($data['statut'], ['prete', 'livree', 'refusee'], true)) {
            $data['processed_by_user_id'] = $request->user()->id;
            $data['processed_at'] = now();
        }

        $registrePrintRequest->update($data);

        return response()->json($registrePrintRequest->fresh('inscription'));
    }

    /** PDF of the fiche tied to a print request (admin). */
    public function pdf(Request $request, RegistrePrintRequest $registrePrintRequest)
    {
        if ($registrePrintRequest->statut === 'en_attente') {
            $registrePrintRequest->update([
                'statut' => 'en_traitement',
                'processed_by_user_id' => $request->user()->id,
            ]);
        }

        return $this->downloadFiche($registrePrintRequest->inscription);
    }

    /** PDF of any fiche, regardless of a print request (admin). */
    public function pdfForInscription(RegistreInscription $registreInscription)
    {
        return $this->downloadFiche($registreInscription);
    }

    private function downloadFiche(RegistreInscription $inscription): Response
    {
        $inscription->load('sacrements');

        $pdf = Pdf::loadView('pdf.registre-fiche', ['inscription' => $inscription])
            ->setPaper('a4');

        $slug = Str::slug($inscription->nom.'-'.$inscription->prenom) ?: 'fiche';

        return $pdf->download("fiche-registre-{$slug}.pdf");
    }
}
