<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageBlock;
use App\Models\PageContent;
use Illuminate\Http\Request;

/**
 * Editable presentation pages (Genèse, Histoire, Savio, Organisation,
 * Archidiocèse, Caritas). A page is a PageContent row (hero + intro +
 * extras) plus a list of PageBlock rows (curés, timeline steps, cards...).
 */
class PageContentController extends Controller
{
    public const PAGES = ['genese', 'histoire', 'savio', 'organisation', 'archidiocese', 'caritas'];

    public function index()
    {
        return response()->json(PageContent::with('blocks')->where('is_active', true)->get());
    }

    public function show(string $key)
    {
        abort_unless(in_array($key, self::PAGES, true), 404);
        $page = PageContent::with('blocks')->where('key', $key)->where('is_active', true)->first();

        if (! $page) {
            return response()->json(null, 204);
        }

        return response()->json($page);
    }

    public function adminIndex()
    {
        return response()->json(PageContent::with('blocks')->orderBy('key')->get());
    }

    public function update(Request $request, string $key)
    {
        abort_unless(in_array($key, self::PAGES, true), 404);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'hero_image' => 'nullable|string|max:255',
            'intro' => 'nullable|string',
            'extra' => 'nullable|array',
        ]);

        $page = PageContent::updateOrCreate(['key' => $key], $data);

        if ($request->has('blocks')) {
            $blocks = $request->validate([
                'blocks' => 'present|array',
                'blocks.*.kind' => 'required|string|max:50',
                'blocks.*.title' => 'nullable|string|max:255',
                'blocks.*.subtitle' => 'nullable|string|max:255',
                'blocks.*.description' => 'nullable|string',
                'blocks.*.image' => 'nullable|string|max:255',
                'blocks.*.meta' => 'nullable|string|max:255',
                'blocks.*.icon' => 'nullable|string|max:20',
                'blocks.*.is_highlight' => 'boolean',
                'blocks.*.sort_order' => 'integer',
            ])['blocks'];

            $keptIds = [];
            foreach ($blocks as $i => $block) {
                $payload = [...$block, 'page_key' => $key, 'sort_order' => $block['sort_order'] ?? $i];
                if (isset($block['id'])) {
                    $existing = PageBlock::where('page_key', $key)->find($block['id']);
                    if ($existing) {
                        $existing->update($payload);
                        $keptIds[] = $existing->id;

                        continue;
                    }
                }
                $created = PageBlock::create($payload);
                $keptIds[] = $created->id;
            }

            PageBlock::where('page_key', $key)->whereNotIn('id', $keptIds)->delete();
        }

        return response()->json(PageContent::with('blocks')->find($page->id));
    }
}
