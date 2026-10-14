<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistreSacrement;
use Illuminate\Http\Request;

class RegistreSacrementController extends Controller
{
    private const TYPES = ['bapteme', 'communion', 'confirmation', 'mariage'];

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['source'] = 'public';

        $sacrement = RegistreSacrement::create($data);

        return response()->json($sacrement, 201);
    }

    public function adminIndex(Request $request)
    {
        $query = RegistreSacrement::latest();

        if ($type = $request->query('type')) {
            if (in_array($type, self::TYPES, true)) {
                $query->where('type', $type);
            }
        }

        if ($q = $request->query('q')) {
            $query->where(function ($w) use ($q) {
                $w->where('nom', 'like', "%{$q}%")
                    ->orWhere('conjoint', 'like', "%{$q}%")
                    ->orWhere('pere', 'like', "%{$q}%")
                    ->orWhere('mere', 'like', "%{$q}%")
                    ->orWhere('numero_registre', 'like', "%{$q}%");
            });
        }

        return response()->json($query->get());
    }

    public function adminStore(Request $request)
    {
        $data = $this->validated($request);
        $data['source'] = 'admin';
        $data['created_by_user_id'] = $request->user()->id;

        $sacrement = RegistreSacrement::create($data);

        return response()->json($sacrement, 201);
    }

    public function update(Request $request, RegistreSacrement $registreSacrement)
    {
        $registreSacrement->update($this->validated($request));

        return response()->json($registreSacrement);
    }

    public function destroy(RegistreSacrement $registreSacrement)
    {
        $registreSacrement->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'type' => 'required|in:'.implode(',', self::TYPES),
            'nom' => 'required|string|max:255',
            'sexe' => 'nullable|in:fils,fille',
            'pere' => 'nullable|string|max:255',
            'mere' => 'nullable|string|max:255',
            'date_naissance' => 'nullable|date',
            'date_evenement' => 'nullable|date',
            'lieu' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:100',
            'numero_registre' => 'nullable|string|max:100',
            'parrain_marraine' => 'nullable|string|max:255',
            'conjoint' => 'nullable|string|max:255',
            'baptise_a' => 'nullable|string|max:255',
            'temoins' => 'nullable|string|max:255',
            'ministre' => 'nullable|string|max:255',
            'signataire' => 'nullable|string|max:255',
            'date_certificat' => 'nullable|date',
            'remarques' => 'nullable|string',
        ]);
    }
}
