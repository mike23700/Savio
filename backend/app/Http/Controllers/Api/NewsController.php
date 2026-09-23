<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    // ── Public ────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $query = News::with('category')
            ->where('is_published', true)
            ->orderByDesc('published_at');

        if ($slug = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        if ($limit = (int) $request->query('limit')) {
            $query->limit($limit);
        }

        return response()->json($query->get());
    }

    public function show(News $news)
    {
        abort_unless($news->is_published, 404);

        return response()->json($news->load('category'));
    }

    public function categories()
    {
        return response()->json(NewsCategory::orderBy('sort_order')->orderBy('name')->get());
    }

    // ── Admin: articles ───────────────────────────────────────────────────

    public function adminIndex()
    {
        return response()->json(News::with('category')->orderByDesc('published_at')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']) . '-' . now()->format('YmdHis');

        return response()->json(News::create($data)->load('category'), 201);
    }

    public function update(Request $request, News $news)
    {
        $data = $this->validated($request);

        if (($data['img'] ?? null) !== $news->img) {
            $this->deleteStoredImage($news->img);
        }

        $news->update($data);

        return response()->json($news->load('category'));
    }

    public function destroy(News $news)
    {
        $this->deleteStoredImage($news->img);
        $news->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'news_category_id' => 'nullable|exists:news_categories,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'img' => 'nullable|string|max:500',
            'published_at' => 'required|date',
            'is_published' => 'boolean',
        ]);
    }

    /** Only uploaded files (relative paths) live on our disk; URLs are left alone. */
    private function deleteStoredImage(?string $img): void
    {
        if ($img && ! preg_match('#^https?://#', $img)) {
            Storage::disk('public')->delete($img);
        }
    }

    // ── Admin: categories ─────────────────────────────────────────────────

    public function storeCategory(Request $request)
    {
        $data = $this->validatedCategory($request);

        return response()->json(NewsCategory::create($data), 201);
    }

    public function updateCategory(Request $request, NewsCategory $category)
    {
        $category->update($this->validatedCategory($request, $category));

        return response()->json($category);
    }

    public function destroyCategory(NewsCategory $category)
    {
        // Articles keep existing, they just become uncategorised (nullOnDelete).
        $category->delete();

        return response()->json(null, 204);
    }

    private function validatedCategory(Request $request, ?NewsCategory $current = null): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort_order' => 'integer',
        ]);
        $data['slug'] = Str::slug($data['name']);
        $data['color'] = $data['color'] ?? '#0B3D91';

        validator($data, [
            'slug' => [Rule::unique('news_categories', 'slug')->ignore($current?->id)],
        ], ['slug.unique' => 'Une catégorie porte déjà ce nom.'])->validate();

        return $data;
    }
}
