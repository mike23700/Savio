<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntentionMesse;
use App\Services\NextMassCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class IntentionMesseController extends Controller
{
    public function store(Request $request, NextMassCalculator $calculator)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            'description' => 'required|string',
            // "yesterday" leaves room for visitors whose timezone is behind the server's
            'date_souhaitee' => 'nullable|date_format:Y-m-d|after_or_equal:yesterday',
            'heure_souhaitee' => 'nullable|string|max:50',
        ]);
        $data['user_id'] = $request->user()?->id;
        $data['heure_souhaitee'] = null;
        $data['messe_type'] = null;

        // The mass must be one of those actually celebrated that day.
        if (! empty($data['date_souhaitee'])) {
            $masses = collect($calculator->massesOn(Carbon::parse($data['date_souhaitee'])));
            if ($masses->isNotEmpty()) {
                $mass = $masses->firstWhere('time', $request->input('heure_souhaitee'));
                if (! $mass) {
                    throw ValidationException::withMessages([
                        'heure_souhaitee' => ['Veuillez choisir l\'une des messes célébrées ce jour-là.'],
                    ]);
                }
                $data['heure_souhaitee'] = $mass['time'];
                $data['messe_type'] = $mass['type'];
            }
        }

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
