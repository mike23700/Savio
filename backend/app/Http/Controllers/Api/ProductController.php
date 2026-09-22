<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)->orderBy('sort_order');
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return response()->json($query->get());
    }

    public function show(string $slug)
    {
        return response()->json(Product::where('slug', $slug)->firstOrFail());
    }

    public function adminIndex()
    {
        return response()->json(Product::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $data['slug'] ?? Str::slug($data['nom']) . '-' . now()->format('Ymd His');

        return response()->json(Product::create($data), 201);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($this->validated($request));

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nom' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'prix' => 'required|numeric|min:0',
            'prix_barre' => 'nullable|numeric|min:0',
            'category' => 'required|string|max:100',
            'img' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
    }
}
