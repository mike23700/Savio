<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeSacrement;
use App\Models\Sacrement;
use Illuminate\Http\Request;

/**
 * "Formulaire de demande" under the sacraments list: anyone can send one,
 * the parish office follows them up in /admin/demandes-sacrements.
 */
class DemandeSacrementController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'sacrement_id' => 'nullable|exists:sacrements,id',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telephone' => 'required|string|max:30',
            'personnes' => 'required|array|min:1|max:20',
            'personnes.*.nom' => 'required|string|max:255',
            'personnes.*.prenom' => 'required|string|max:255',
            'personnes.*.age' => 'nullable|integer|min:0|max:120',
            'message' => 'nullable|string|max:5000',
        ], [
            'personnes.required' => 'Ajoutez au moins une personne concernée.',
            'personnes.*.nom.required' => 'Indiquez le nom de chaque personne concernée.',
            'personnes.*.prenom.required' => 'Indiquez le prénom de chaque personne concernée.',
        ]);

        $data['user_id'] = $request->user('sanctum')?->id;
        $data['sacrement_nom'] = isset($data['sacrement_id'])
            ? Sacrement::find($data['sacrement_id'])?->title
            : null;
        $data['personnes'] = array_values(array_map(fn ($p) => [
            'nom' => trim($p['nom']),
            'prenom' => trim($p['prenom']),
            'age' => isset($p['age']) && $p['age'] !== '' ? (int) $p['age'] : null,
        ], $data['personnes']));

        return response()->json(DemandeSacrement::create($data), 201);
    }

    public function adminIndex(Request $request)
    {
        $query = DemandeSacrement::latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        return response()->json($query->get());
    }

    public function update(Request $request, DemandeSacrement $demande)
    {
        $data = $request->validate(['statut' => 'required|in:nouvelle,en_cours,traitee,annulee']);
        $demande->update($data);

        return response()->json($demande);
    }

    public function destroy(DemandeSacrement $demande)
    {
        $demande->delete();

        return response()->json(null, 204);
    }
}
