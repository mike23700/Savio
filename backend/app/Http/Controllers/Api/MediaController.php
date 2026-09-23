<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaCategory;
use App\Models\MediaItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class MediaController extends Controller
{
    // ── Public ────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = MediaItem::with('category')->where('is_published', true)
            ->orderBy('sort_order')->orderByDesc('taken_at')->orderByDesc('id');

        if (in_array($type = $request->query('type'), ['photo', 'video'], true)) {
            $query->where('type', $type);
        }

        return response()->json($query->get());
    }

    public function categories()
    {
        return response()->json(MediaCategory::orderBy('sort_order')->orderBy('name')->get());
    }

    // ── Admin: items ──────────────────────────────────────────────────────

    public function adminIndex()
    {
        return response()->json(MediaItem::with('category')->orderBy('sort_order')->orderByDesc('taken_at')->orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        return response()->json(MediaItem::create($this->validated($request))->load('category'), 201);
    }

    public function update(Request $request, MediaItem $media)
    {
        $data = $this->validated($request);
        if ($media->image && ($data['image'] ?? null) !== $media->image) {
            $this->deleteStoredImage($media->image);
        }
        $media->update($data);

        return response()->json($media->load('category'));
    }

    public function destroy(MediaItem $media)
    {
        $this->deleteStoredImage($media->image);
        $media->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'type' => 'required|in:photo,video',
            'media_category_id' => 'nullable|exists:media_categories,id',
            'title' => 'nullable|string|max:255',
            'image' => 'required_if:type,photo|nullable|string|max:500',
            'youtube_url' => 'required_if:type,video|nullable|string|max:500',
            'taken_at' => 'nullable|date',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ], [
            'image.required_if' => 'Importez une photo.',
            'youtube_url.required_if' => 'Collez le lien de la vidéo YouTube.',
        ]);

        if ($data['type'] === 'video') {
            $data['youtube_id'] = MediaItem::youtubeId($data['youtube_url'] ?? null);
            if (! $data['youtube_id']) {
                throw ValidationException::withMessages(['youtube_url' => 'Lien YouTube non reconnu.']);
            }
            $data['image'] = null;
        } else {
            $data['youtube_url'] = null;
            $data['youtube_id'] = null;
        }

        return $data;
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path && ! preg_match('#^https?://#', $path)) {
            Storage::disk('public')->delete($path);
        }
    }

    // ── Admin: categories ─────────────────────────────────────────────────

    public function storeCategory(Request $request)
    {
        return response()->json(MediaCategory::create($this->validatedCategory($request)), 201);
    }

    public function updateCategory(Request $request, MediaCategory $category)
    {
        $category->update($this->validatedCategory($request, $category));

        return response()->json($category);
    }

    public function destroyCategory(MediaCategory $category)
    {
        $category->delete();

        return response()->json(null, 204);
    }

    private function validatedCategory(Request $request, ?MediaCategory $current = null): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'sort_order' => 'integer',
        ]);
        $data['slug'] = Str::slug($data['name']);

        validator($data, [
            'slug' => [Rule::unique('media_categories', 'slug')->ignore($current?->id)],
        ], ['slug.unique' => 'Une catégorie porte déjà ce nom.'])->validate();

        return $data;
    }
}
