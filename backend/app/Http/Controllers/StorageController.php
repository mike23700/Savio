<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Fallback for /storage/<path>.
 *
 * The normal setup is `php artisan storage:link`, which lets Apache serve
 * storage/app/public directly. On shared hosting where symlinks are disabled
 * (or storage:link was not run yet), public/.htaccess sends the request to
 * Laravel and this controller streams the file instead.
 */
class StorageController extends Controller
{
    public function __invoke(string $path): BinaryFileResponse
    {
        abort_if(str_contains($path, '..') || str_contains($path, "\0"), 404);

        $disk = Storage::disk('public');

        abort_unless($disk->exists($path), 404);

        $root = realpath($disk->path(''));
        $file = realpath($disk->path($path));

        abort_unless(
            $root !== false
                && $file !== false
                && str_starts_with($file, $root.DIRECTORY_SEPARATOR),
            404,
        );

        return response()->file($file, [
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
