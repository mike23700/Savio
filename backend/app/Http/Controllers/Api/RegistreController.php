<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistreInscription;
use App\Models\RegistreSacrement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistreController extends Controller
{
    private const SACREMENT_TYPES = ['bapteme', 'communion', 'confirmation', 'mariage'];

    /** Sacraments whose register number (`numero_registre`) is sequential. */
    private const NUMERO_REGISTRE_TYPES = ['bapteme', 'mariage'];

    public function nextNumero(Request $request)
    {
        $type = $request->query('type');
        if (!in_array($type, self::NUMERO_REGISTRE_TYPES, true)) {
            return response()->json(['message' => 'Type de sacrement invalide.'], 422);
        }

        return response()->json(['numero_registre' => (string) $this->nextNumeroFor($type)]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        $sacrements = $data['sacrements'] ?? [];
        unset($data['sacrements']);
        $data['source'] = 'public';

        $inscription = DB::transaction(function () use ($data, $sacrements) {
            $inscription = RegistreInscription::create($data);
            $this->syncSacrements($inscription, $sacrements, 'public');
            return $inscription;
        });

        return response()->json($inscription->load('sacrements'), 201);
    }

    public function adminIndex(Request $request)
    {
        $query = RegistreInscription::with('sacrements')->latest();
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
        $data = $request->validate($this->rules());
        $sacrements = $data['sacrements'] ?? [];
        unset($data['sacrements']);
        $data['source'] = 'admin';
        $data['created_by_user_id'] = $request->user()->id;

        $inscription = DB::transaction(function () use ($data, $sacrements) {
            $inscription = RegistreInscription::create($data);
            $this->syncSacrements($inscription, $sacrements, 'admin');
            return $inscription;
        });

        return response()->json($inscription->load('sacrements'), 201);
    }

    public function update(Request $request, RegistreInscription $registreInscription)
    {
        $data = $request->validate($this->rules());
        $sacrements = $data['sacrements'] ?? [];
        unset($data['sacrements']);

        DB::transaction(function () use ($registreInscription, $data, $sacrements) {
            $registreInscription->update($data);
            $this->syncSacrements($registreInscription, $sacrements, 'admin');
        });

        return response()->json($registreInscription->load('sacrements'));
    }

    public function destroy(RegistreInscription $registreInscription)
    {
        $registreInscription->sacrements()->delete();
        $registreInscription->delete();

        return response()->json(null, 204);
    }

    /**
     * Upsert the sacraments of an inscription, keyed by type, and remove the
     * ones that are no longer provided.
     */
    private function syncSacrements(RegistreInscription $inscription, array $sacrements, string $source): void
    {
        $existing = $inscription->sacrements()->get()->keyBy('type');
        $keptTypes = [];

        foreach ($sacrements as $data) {
            $keptTypes[] = $data['type'];
            if ($current = $existing->get($data['type'])) {
                $current->update($data);
            } else {
                if (in_array($data['type'], self::NUMERO_REGISTRE_TYPES, true) && ($data['numero_registre'] ?? null) === null) {
                    $data['numero_registre'] = (string) $this->nextNumeroFor($data['type']);
                }
                $inscription->sacrements()->create($data + ['source' => $source]);
            }
        }

        $inscription->sacrements()->whereNotIn('type', $keptTypes)->delete();
    }

    /**
     * Next register number for a sacrament type, based on the highest numeric
     * value already stored (so "LB-002" counts as 2).
     */
    private function nextNumeroFor(string $type): int
    {
        $max = 0;
        foreach (RegistreSacrement::where('type', $type)->pluck('numero_registre') as $value) {
            if (preg_match('/\d+/', (string) $value, $matches)) {
                $max = max($max, (int) $matches[0]);
            }
        }

        return $max + 1;
    }

    private function rules(): array
    {
        return array_merge([
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
            'sacrements' => 'array',
        ], $this->sacrementRules());
    }

    private function sacrementRules(): array
    {
        $fields = [
            'type' => 'required|in:'.implode(',', self::SACREMENT_TYPES),
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
        ];

        $rules = [];
        foreach ($fields as $key => $rule) {
            $rules["sacrements.*.{$key}"] = $rule;
        }

        return $rules;
    }
}
