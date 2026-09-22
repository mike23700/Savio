<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mouvement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MouvementController extends Controller
{
    public function index(Request $request)
    {
        $query = Mouvement::where('is_active', true)->orderBy('sort_order')->with('details');
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return response()->json($query->get());
    }

    public function show(string $slug)
    {
        return response()->json(Mouvement::where('slug', $slug)->with('details')->firstOrFail());
    }

    public function adminIndex()
    {
        return response()->json(Mouvement::orderBy('sort_order')->with('details')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $details = $data['details'] ?? [];
        unset($data['details']);

        $mouvement = Mouvement::create($data);
        $this->syncDetails($mouvement, $details);

        return response()->json($mouvement->load('details'), 201);
    }

    public function update(Request $request, Mouvement $mouvement)
    {
        $data = $this->validated($request);
        $details = $data['details'] ?? null;
        unset($data['details']);

        $mouvement->update($data);
        if ($details !== null) {
            $this->syncDetails($mouvement, $details);
        }

        return response()->json($mouvement->fresh('details'));
    }

    public function destroy(Mouvement $mouvement)
    {
        $mouvement->delete();

        return response()->json(null, 204);
    }

    private function syncDetails(Mouvement $mouvement, array $details): void
    {
        $mouvement->details()->delete();
        foreach (array_values($details) as $i => $detail) {
            $mouvement->details()->create(['detail' => $detail, 'sort_order' => $i]);
        }
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'category' => 'required|in:conseil,mouvement,chorale,cev',
            'slug' => 'nullable|string|max:255|unique:mouvements,slug,' . $request->route('mouvement')?->id,
            'icon' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'image' => 'nullable|string|max:500',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'details' => 'nullable|array',
            'details.*' => 'string',
        ]);
    }
}
