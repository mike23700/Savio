<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjetController extends Controller
{
    public function index(Request $request)
    {
        $query = Projet::where('is_active', true)->orderBy('sort_order');
        if ($statut = $request->query('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json($query->get());
    }

    public function show(Projet $projet)
    {
        return response()->json($projet->load('photos'));
    }

    public function adminIndex()
    {
        return response()->json(Projet::orderBy('sort_order')->withCount('photos')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['titre']) . '-' . now()->format('Ymd His');

        $projet = Projet::create($data);

        return response()->json($projet, 201);
    }

    public function update(Request $request, Projet $projet)
    {
        $projet->update($this->validated($request));

        return response()->json($projet);
    }

    public function destroy(Projet $projet)
    {
        $projet->delete();

        return response()->json(null, 204);
    }

    public function uploadPhotos(Request $request, Projet $projet)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|max:5120',
        ]);

        $nextOrder = $projet->photos()->max('sort_order') + 1;
        $created = [];
        foreach ($request->file('photos') as $i => $file) {
            $path = $file->store('projets', 'public');
            $created[] = $projet->photos()->create([
                'url' => url(Storage::url($path)),
                'sort_order' => $nextOrder + $i,
            ]);
        }

        return response()->json($created, 201);
    }

    public function destroyPhoto(Projet $projet, int $photoId)
    {
        $photo = $projet->photos()->findOrFail($photoId);
        $photo->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'titre' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'statut' => 'required|in:en_cours,termine',
            'objectif' => 'required|numeric|min:0',
            'collecte' => 'numeric|min:0',
            'image' => 'nullable|string|max:500',
            'details' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }
}
