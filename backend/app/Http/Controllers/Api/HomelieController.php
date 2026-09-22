<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Homelie;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HomelieController extends Controller
{
    public function index(Request $request)
    {
        $query = Homelie::where('is_published', true)->orderByDesc('published_at');

        if ($q = $request->query('q')) {
            $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")->orWhere('sunday', 'like', "%{$q}%");
            });
        }

        return response()->json($query->get());
    }

    public function latest()
    {
        $homelie = Homelie::where('is_published', true)->orderByDesc('published_at')->first();

        return response()->json($homelie);
    }

    public function show(string $slug)
    {
        return response()->json(Homelie::where('slug', $slug)->firstOrFail());
    }

    public function adminIndex()
    {
        return response()->json(Homelie::orderByDesc('published_at')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']) . '-' . now()->format('Ymd His');

        return response()->json(Homelie::create($data), 201);
    }

    public function update(Request $request, Homelie $homelie)
    {
        $homelie->update($this->validated($request));

        return response()->json($homelie);
    }

    public function destroy(Homelie $homelie)
    {
        $homelie->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'priest' => 'nullable|string|max:255',
            'readings' => 'nullable|string|max:500',
            'sunday' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:50',
            'excerpt' => 'nullable|string',
            'img' => 'nullable|string|max:500',
            'published_at' => 'required|date',
            'audio_url' => 'nullable|string|max:500',
            'pdf_url' => 'nullable|string|max:500',
            'is_published' => 'boolean',
        ]);
    }
}
