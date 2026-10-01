<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Parish accounting: every cash movement is recorded as an income (entrée) or an
 * expense (sortie), optionally attached to a category so the admin can filter
 * and total per category. The category type must match the movement type.
 */
class TransactionController extends Controller
{
    // ── Admin: movements ──────────────────────────────────────────────────

    /** Movements matching the filters, plus the totals of that same selection. */
    public function index(Request $request)
    {
        $filters = array_merge([
            'type' => null,
            'transaction_category_id' => null,
            'du' => null,
            'au' => null,
            'q' => null,
        ], $this->validatedFilters($request));

        $query = Transaction::with('category')
            ->when($filters['type'], fn ($q, $type) => $q->where('type', $type))
            ->when($filters['transaction_category_id'], fn ($q, $id) => $q->where('transaction_category_id', $id))
            ->when($filters['du'], fn ($q, $du) => $q->whereDate('date', '>=', $du))
            ->when($filters['au'], fn ($q, $au) => $q->whereDate('date', '<=', $au))
            ->when($filters['q'], fn ($q, $term) => $q->where(fn ($w) => $w
                ->where('libelle', 'like', "%{$term}%")
                ->orWhere('reference', 'like', "%{$term}%")
                ->orWhere('notes', 'like', "%{$term}%")));

        $entrees = (clone $query)->where('type', 'entree')->sum('montant');
        $sorties = (clone $query)->where('type', 'sortie')->sum('montant');

        return response()->json([
            'transactions' => $query->orderByDesc('date')->orderByDesc('id')->get(),
            'totaux' => [
                'entrees' => (int) $entrees,
                'sorties' => (int) $sorties,
                'solde' => (int) $entrees - (int) $sorties,
            ],
        ]);
    }

    public function store(Request $request)
    {
        return response()->json(Transaction::create($this->validated($request))->load('category'), 201);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $transaction->update($this->validated($request, $transaction));

        return response()->json($transaction->load('category'));
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return response()->json(null, 204);
    }

    // ── Admin: categories ─────────────────────────────────────────────────

    public function categories()
    {
        return response()->json(TransactionCategory::withCount('transactions')->orderBy('type')->orderBy('sort_order')->orderBy('id')->get());
    }

    public function storeCategory(Request $request)
    {
        return response()->json(TransactionCategory::create($this->validatedCategory($request)), 201);
    }

    public function updateCategory(Request $request, TransactionCategory $category)
    {
        $category->update($this->validatedCategory($request));

        return response()->json($category);
    }

    public function destroyCategory(TransactionCategory $category)
    {
        // Movements keep existing, they just become uncategorised (nullOnDelete).
        $category->delete();

        return response()->json(null, 204);
    }

    // ── Validation ────────────────────────────────────────────────────────

    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'type' => 'nullable|in:entree,sortie',
            'transaction_category_id' => 'nullable|integer|exists:transaction_categories,id',
            'du' => 'nullable|date_format:Y-m-d',
            'au' => 'nullable|date_format:Y-m-d|after_or_equal:du',
            'q' => 'nullable|string|max:100',
        ]);
    }

    /**
     * On create every field is required; on update the caller may send only what
     * changes, so each rule becomes "required only when present".
     */
    private function validated(Request $request, ?Transaction $current = null): array
    {
        $required = $current ? 'sometimes|required' : 'required';
        $type = $request->input('type', $current?->type);

        $data = $request->validate([
            'type' => "{$required}|in:entree,sortie",
            'libelle' => "{$required}|string|max:255",
            'montant' => "{$required}|numeric|min:1",
            'date' => "{$required}|date_format:Y-m-d",
            'transaction_category_id' => [
                'nullable',
                Rule::exists('transaction_categories', 'id')->where(fn ($q) => $q->where('type', $type)),
            ],
            'reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:2000',
        ], [
            'type.in' => 'Le type doit être « entrée » ou « sortie ».',
            'libelle.required' => 'Le libellé est obligatoire.',
            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric' => 'Le montant doit être un nombre.',
            'montant.min' => 'Le montant doit être supérieur à 0.',
            'date.required' => 'La date est obligatoire.',
            'date.date_format' => 'La date doit être au format AAAA-MM-JJ.',
            // The most likely mistake: picking a category of the wrong type.
            'transaction_category_id.exists' => 'Cette catégorie n\'existe pas ou ne correspond pas au type du mouvement (une catégorie « sortie » pour une dépense, « entrée » pour une recette).',
        ]);

        if (array_key_exists('transaction_category_id', $data) && empty($data['transaction_category_id'])) {
            $data['transaction_category_id'] = null;
        }

        return $data;
    }

    private function validatedCategory(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:entree,sortie',
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort_order' => 'integer',
        ]);
        $data['color'] = $data['color'] ?? '#0B3D91';

        return $data;
    }
}
