<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Generic admin image upload. The admin forms upload the file here first,
 * then save the returned relative path ("news/abc.jpg") in their own
 * image field, served publicly under /storage/<path>.
 */
class UploadController extends Controller
{
    private const FOLDERS = ['news', 'team', 'homelies', 'products', 'projets', 'sacrements', 'media', 'misc'];

    public function image(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|image|max:5120',
            'folder' => 'nullable|string|in:' . implode(',', self::FOLDERS),
        ]);

        $path = $request->file('file')->store($data['folder'] ?? 'misc', 'public');

        return response()->json(['path' => $path, 'url' => '/storage/' . $path], 201);
    }
}
