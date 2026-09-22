<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistreInscription;
use Illuminate\Http\Request;

class RegistreController extends Controller
{
    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['source'] = 'public';

        $inscription = RegistreInscription::create($data);

        return response()->json($inscription, 201);
    }

    public function adminIndex(Request $request)
    {
        $query = RegistreInscription::latest();
        if ($q = $request->query('q')) {
            $query->where(function ($w) use ($q) {
                $w->where('nom', 'like', "%{$q}%")
                    ->orWhere('prenom', 'like', "%{$q}%")
                    ->orWhere('telephone', 'like', "%{$q}%");
            });
        }

        return response()->json($query->get());
    }

    public function adminStore(Request $request)
    {
        $data = $this->validated($request);
        $data['source'] = 'admin';
        $data['created_by_user_id'] = $request->user()->id;

        $inscription = RegistreInscription::create($data);

        return response()->json($inscription, 201);
    }

    public function destroy(RegistreInscription $registreInscription)
    {
        $registreInscription->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            'tranche_age' => 'nullable|string|max:50',
            'rue' => 'nullable|string|max:255',
            'quartier' => 'nullable|string|max:255',
            'lieu_dit' => 'nullable|string|max:255',
            'membre_cev' => 'boolean',
            'quelle_cev' => 'nullable|string|max:255',
            'membre_groupe' => 'boolean',
            'quel_groupe' => 'nullable|string|max:255',
            'anciennete' => 'nullable|string|max:100',
        ]);
    }
}
