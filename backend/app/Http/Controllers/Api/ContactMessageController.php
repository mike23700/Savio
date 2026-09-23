<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'nullable|string|max:30',
            'sujet' => 'required|string|max:100',
            'message' => 'required|string|max:5000',
        ]);
        $data['user_id'] = $request->user()?->id;

        $contactMessage = ContactMessage::create($data);

        return response()->json($contactMessage, 201);
    }

    public function adminIndex(Request $request)
    {
        $query = ContactMessage::latest();

        if ($request->filled('statut')) {
            $query->where('statut', $request->query('statut'));
        }

        return response()->json($query->get());
    }

    public function update(Request $request, ContactMessage $contactMessage)
    {
        $data = $request->validate(['statut' => 'required|in:nouveau,traite,archive']);
        $contactMessage->update($data);

        return response()->json($contactMessage);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json(null, 204);
    }
}
