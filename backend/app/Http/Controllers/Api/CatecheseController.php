<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatecheseInscription;
use App\Models\CatecheseNiveau;
use Illuminate\Http\Request;

class CatecheseController extends Controller
{
    public function niveaux()
    {
        return response()->json(CatecheseNiveau::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function adminNiveaux()
    {
        return response()->json(CatecheseNiveau::orderBy('sort_order')->get());
    }

    public function storeNiveau(Request $request)
    {
        return response()->json(CatecheseNiveau::create($this->validatedNiveau($request)), 201);
    }

    public function updateNiveau(Request $request, CatecheseNiveau $niveau)
    {
        $niveau->update($this->validatedNiveau($request));

        return response()->json($niveau);
    }

    public function destroyNiveau(CatecheseNiveau $niveau)
    {
        $niveau->delete();

        return response()->json(null, 204);
    }

    public function storeInscription(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            'niveau_id' => 'nullable|exists:catechese_niveaux,id',
            'age' => 'nullable|string|max:20',
        ]);
        $data['user_id'] = $request->user()?->id;

        $inscription = CatecheseInscription::create($data);

        return response()->json($inscription, 201);
    }

    public function adminInscriptions()
    {
        return response()->json(CatecheseInscription::with('niveau')->latest()->get());
    }

    public function updateInscription(Request $request, CatecheseInscription $inscription)
    {
        $data = $request->validate(['statut' => 'required|in:en_attente,confirmee,annulee']);
        $inscription->update($data);

        return response()->json($inscription);
    }

    private function validatedNiveau(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'age_label' => 'nullable|string|max:100',
            'icon' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'duree' => 'nullable|string|max:100',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }
}
