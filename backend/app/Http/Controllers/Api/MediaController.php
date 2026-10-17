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

        if (in_array($type = $request->query('type'), ['photo', 'video', 'chant'], true)) {
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
        if ($media->audio_url && ($data['audio_url'] ?? null) !== $media->audio_url) {
            $this->deleteStoredImage($media->audio_url);
        }
        if ($media->pdf_url && ($data['pdf_url'] ?? null) !== $media->pdf_url) {
            $this->deleteStoredImage($media->pdf_url);
        }
        $media->update($data);

        return response()->json($media->load('category'));
    }

    public function destroy(MediaItem $media)
    {
        $this->deleteStoredImage($media->image);
        $this->deleteStoredImage($media->audio_url);
        $this->deleteStoredImage($media->pdf_url);
        $media->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'type' => 'required|in:photo,video,chant',
            'media_category_id' => 'nullable|exists:media_categories,id',
            'title' => 'required_if:type,chant|nullable|string|max:255',
            'language' => 'required_if:type,chant|nullable|string|max:50',
            'image' => 'required_if:type,photo|nullable|string|max:500',
            'youtube_url' => 'required_if:type,video|nullable|string|max:500',
            'audio_url' => 'nullable|string|max:500',
            'pdf_url' => 'nullable|string|max:500',
            'taken_at' => 'nullable|date',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ], [
            'image.required_if' => 'Importez une photo.',
            'youtube_url.required_if' => 'Collez le lien de la vidéo YouTube.',
            'title.required_if' => 'Donnez un titre au chant.',
            'language.required_if' => 'Précisez la langue du chant.',
        ]);

        if ($data['type'] === 'video') {
            $data['youtube_id'] = MediaItem::youtubeId($data['youtube_url'] ?? null);
            if (! $data['youtube_id']) {
                throw ValidationException::withMessages(['youtube_url' => 'Lien YouTube non reconnu.']);
            }
            $data['image'] = null;
            $data['audio_url'] = null;
            $data['pdf_url'] = null;
            $data['language'] = null;
        } elseif ($data['type'] === 'chant') {
            // Optional YouTube link: resolve the id when present, reject bad links.
            $youtubeUrl = trim($data['youtube_url'] ?? '');
            if ($youtubeUrl !== '') {
                $data['youtube_id'] = MediaItem::youtubeId($youtubeUrl);
                if (! $data['youtube_id']) {
                    throw ValidationException::withMessages(['youtube_url' => 'Lien YouTube non reconnu.']);
                }
                $data['youtube_url'] = $youtubeUrl;
            } else {
                $data['youtube_url'] = null;
                $data['youtube_id'] = null;
            }
            $data['image'] = null;
            if (empty($data['audio_url']) && empty($data['pdf_url']) && empty($data['youtube_url'])) {
                throw ValidationException::withMessages([
                    'audio_url' => 'Ajoutez un audio, un lien vidéo ou un fichier PDF.',
                ]);
            }
        } else {
            $data['youtube_url'] = null;
            $data['youtube_id'] = null;
            $data['audio_url'] = null;
            $data['pdf_url'] = null;
            $data['language'] = null;
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
