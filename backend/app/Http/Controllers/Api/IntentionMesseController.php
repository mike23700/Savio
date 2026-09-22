<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntentionMesse;
use Illuminate\Http\Request;

class IntentionMesseController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            'description' => 'required|string',
            'date_souhaitee' => 'nullable|date',
        ]);
        $data['user_id'] = $request->user()?->id;

        $intention = IntentionMesse::create($data);

        return response()->json($intention, 201);
    }

    public function adminIndex()
    {
        return response()->json(IntentionMesse::latest()->get());
    }

    public function update(Request $request, IntentionMesse $intention)
    {
        $data = $request->validate(['statut' => 'required|in:en_attente,planifiee,celebree,annulee']);
        $intention->update($data);

        return response()->json($intention);
    }
}
