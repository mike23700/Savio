<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sacrement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SacrementController extends Controller
{
    public function index()
    {
        return response()->json(Sacrement::where('is_active', true)->orderBy('sort_order')->with('details')->get());
    }

    public function show(string $slug)
    {
        $sacrement = Sacrement::where('slug', $slug)->with('details')->firstOrFail();

        return response()->json($sacrement);
    }

    public function adminIndex()
    {
        return response()->json(Sacrement::orderBy('sort_order')->with('details')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $details = $data['details'] ?? [];
        unset($data['details']);

        $sacrement = Sacrement::create($data);
        $this->syncDetails($sacrement, $details);

        return response()->json($sacrement->load('details'), 201);
    }

    public function update(Request $request, Sacrement $sacrement)
    {
        $data = $this->validated($request);
        $details = $data['details'] ?? null;
        unset($data['details']);

        $sacrement->update($data);
        if ($details !== null) {
            $this->syncDetails($sacrement, $details);
        }

        return response()->json($sacrement->fresh('details'));
    }

    public function destroy(Sacrement $sacrement)
    {
        $sacrement->delete();

        return response()->json(null, 204);
    }

    private function syncDetails(Sacrement $sacrement, array $details): void
    {
        $sacrement->details()->delete();
        foreach (array_values($details) as $i => $detail) {
            $sacrement->details()->create(['detail' => $detail, 'sort_order' => $i]);
        }
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'slug' => 'nullable|string|max:255|unique:sacrements,slug,' . $request->route('sacrement')?->id,
            'icon' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'img' => 'nullable|string|max:500',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'details' => 'nullable|array',
            'details.*' => 'string',
        ]);
    }
}
