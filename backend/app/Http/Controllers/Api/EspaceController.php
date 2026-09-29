<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Espace;
use App\Services\EspaceAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/** Guest rooms of the welcome centre and halls for rent (see App\Models\Espace). */
class EspaceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['kind' => 'nullable|in:chambre,salle']);

        return response()->json(
            Espace::where('is_active', true)
                ->when($request->query('kind'), fn ($q, $kind) => $q->where('kind', $kind))
                ->orderBy('sort_order')->orderBy('id')
                ->get()
        );
    }

    /** One space, with the days already fully booked for the booking calendar. */
    public function show(string $slug, EspaceAvailability $availability)
    {
        $espace = Espace::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return response()->json([...$espace->toArray(), 'jours_complets' => $availability->fullDays($espace)]);
    }

    /** Quote + availability for `?debut=&fin=&unites=` before submitting a booking. */
    public function availability(Request $request, string $slug, EspaceAvailability $availability)
    {
        $espace = Espace::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $data = $request->validate([
            'debut' => 'required|date_format:Y-m-d',
            'fin' => 'required|date_format:Y-m-d',
            'unites' => 'nullable|integer|min:1',
        ]);

        $debut = Carbon::parse($data['debut']);
        $fin = Carbon::parse($data['fin']);
        $units = (int) ($data['unites'] ?? 1);
        $duration = EspaceAvailability::duration($espace, $debut, $fin);
        $left = $duration > 0 ? $availability->unitsLeft($espace, $debut, $fin) : 0;

        return response()->json([
            'duree' => max(0, $duration),
            'unites_restantes' => $left,
            'disponible' => $duration > 0 && $left >= $units,
            'montant' => $espace->hasPrice() && $duration > 0 ? $espace->prix * $duration * $units : null,
        ]);
    }

    public function adminIndex()
    {
        return response()->json(Espace::withCount('reservations')->orderBy('kind')->orderBy('sort_order')->orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['nom']);

        return response()->json(Espace::create($data), 201);
    }

    public function update(Request $request, Espace $espace)
    {
        $espace->update($this->validated($request));

        return response()->json($espace);
    }

    public function destroy(Espace $espace)
    {
        abort_if(
            $espace->reservations()->exists(),
            422,
            'Cet espace a des réservations : désactivez-le plutôt que de le supprimer.'
        );
        $espace->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'kind' => ['required', Rule::in(['chambre', 'salle'])],
            'nom' => 'required|string|max:255',
            'resume' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'capacite' => 'nullable|integer|min:1|max:5000',
            'quantite' => 'required|integer|min:1|max:500',
            'prix' => 'nullable|numeric|min:0',
            'equipements' => 'nullable|array',
            'equipements.*' => 'string|max:100',
            'photos' => 'nullable|array|max:12',
            'photos.*' => 'string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        $data['equipements'] = array_values(array_filter(array_map('trim', $data['equipements'] ?? [])));
        $data['photos'] = array_values(array_filter($data['photos'] ?? []));
        if (empty($data['prix'])) {
            $data['prix'] = null;
        }

        return $data;
    }

    private function uniqueSlug(string $nom): string
    {
        $base = Str::slug($nom) ?: 'espace';
        $slug = $base;
        for ($i = 2; Espace::where('slug', $slug)->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }

        return $slug;
    }
}
