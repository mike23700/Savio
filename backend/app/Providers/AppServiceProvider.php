<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Uploaded files are written to storage/app/public. A fresh clone or a
        // new IONOS deployment starts without these runtime folders, so create
        // them proactively instead of failing on the first upload.
        foreach ([
            'app/public',
            'framework/cache/data',
            'framework/sessions',
            'framework/views',
            'logs',
        ] as $directory) {
            $path = storage_path($directory);
            if (! is_dir($path)) {
                @mkdir($path, 0775, true);
            }
        }

        // IONOS serves the API behind its TLS terminator. Generating https://
        // URLs avoids mixed-content warnings on the frontend and in PDFs.
        if (config('app.force_https')) {
            URL::forceScheme('https');
        }

        // Peex is optional (empty secret → manual payments), but a secret without
        // PEEX_BASE_URL must not silently hit a wrong host in production.
        if (filled(config('services.peex.secret_key')) && blank(config('services.peex.base_url'))) {
            throw new \RuntimeException('Config manquante : services.peex.base_url (PEEX_BASE_URL).');
        }
    }
}
