<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Homelie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $data['readings'] = $this->buildReadings($data);

        foreach (['audio_file' => 'audio', 'pdf_file' => 'pdf'] as $field => $diskDir) {
            if ($request->hasFile($field)) {
                $data[$diskDir . '_url'] = $request->file($field)->store($diskDir, 'public');
            }
        }

        return response()->json(Homelie::create($data), 201);
    }

    public function update(Request $request, Homelie $homelie)
    {
        $data = $this->validated($request);
        $data['readings'] = $this->buildReadings($data, $homelie);

        foreach (['audio_file' => 'audio', 'pdf_file' => 'pdf'] as $field => $diskDir) {
            if ($request->hasFile($field)) {
                // Remove the previous file so orphans don't pile up on disk.
                $previous = $homelie->{$diskDir . '_url'};
                if ($previous) {
                    Storage::disk('public')->delete($previous);
                }
                $data[$diskDir . '_url'] = $request->file($field)->store($diskDir, 'public');
            }
        }

        $homelie->update($data);

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
            'reading_1' => 'nullable|string|max:120',
            'psalm' => 'nullable|string|max:120',
            'reading_2' => 'nullable|string|max:120',
            'gospel' => 'nullable|string|max:120',
            'sunday' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:50',
            'excerpt' => 'nullable|string',
            'img' => 'nullable|string|max:500',
            'published_at' => 'required|date',
            'audio_url' => 'nullable|string|max:500',
            'pdf_url' => 'nullable|string|max:500',
            // Uploaded files take precedence over the URL fields when present.
            'audio_file' => 'nullable|file|mimetypes:audio/mpeg,audio/mp4,audio/ogg,audio/x-m4a,audio/mp3|max:20480',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'is_published' => 'boolean',
        ]);
    }

    /**
     * Build the legacy "readings" summary string ("A · B · C · D") from the
     * structured fields. Keeps the public pages (home, Messes) working with
     * a single string even though the admin now edits 4 separate fields.
     */
    private function buildReadings(array $data, ?Homelie $homelie = null): ?string
    {
        $explicit = $data['readings'] ?? null;

        $structured = collect([$data['reading_1'] ?? null, $data['psalm'] ?? null, $data['reading_2'] ?? null, $data['gospel'] ?? null])
            ->filter(fn ($v) => is_string($v) && trim($v) !== '')
            ->map(fn ($v) => trim($v))
            ->implode(' · ');

        if ($structured !== '') {
            return $structured;
        }

        // No structured field provided: keep the existing/free-text value.
        return $explicit !== null && trim($explicit) !== '' ? $explicit : $homelie?->readings;
    }
}
