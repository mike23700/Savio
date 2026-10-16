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
    private const FOLDERS = ['news', 'team', 'homelies', 'products', 'projets', 'sacrements', 'media', 'pages', 'espaces', 'misc', 'chants'];

    public function image(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|image|max:5120',
            'folder' => 'nullable|string|in:' . implode(',', self::FOLDERS),
        ]);

        $path = $request->file('file')->store($data['folder'] ?? 'misc', 'public');

        return response()->json(['path' => $path, 'url' => '/storage/' . $path], 201);
    }

    /**
     * Generic media upload for the médiathèque chants (audio + paroles PDF).
     * The admin uploads here first, then saves the returned path in the
     * chant's `audio_url` / `pdf_url` field — same flow as images.
     */
    public function file(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|file|mimetypes:audio/mpeg,audio/mp4,audio/ogg,audio/x-m4a,audio/mp3,audio/wav,audio/x-wav,application/pdf|max:20480',
            'folder' => 'nullable|string|in:' . implode(',', self::FOLDERS),
        ], [
            'file.mimetypes' => 'Format accepté : MP3, M4A, OGG, WAV ou PDF.',
        ]);

        $path = $request->file('file')->store($data['folder'] ?? 'chants', 'public');

        return response()->json(['path' => $path, 'url' => '/storage/' . $path], 201);
    }
}
