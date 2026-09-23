<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ban;
use Illuminate\Http\Request;

class BanController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'required|string|max:30',
            'fiance1_nom' => 'required|string|max:255',
            'fiance1_prenom' => 'required|string|max:255',
            'fiance2_nom' => 'required|string|max:255',
            'fiance2_prenom' => 'required|string|max:255',
            'mariage_date' => 'nullable|date',
        ]);
        $data['user_id'] = $request->user()?->id;

        $ban = Ban::create($data);

        return response()->json($ban, 201);
    }

    public function adminIndex(Request $request)
    {
        $query = Ban::latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        return response()->json($query->get());
    }

    public function update(Request $request, Ban $ban)
    {
        $data = $request->validate(['statut' => 'required|in:nouveau,en_cours,publie,archive']);
        $ban->update($data);

        return response()->json($ban);
    }

    public function destroy(Ban $ban)
    {
        $ban->delete();

        return response()->json(null, 204);
    }
}
