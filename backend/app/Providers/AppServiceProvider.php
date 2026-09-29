<?php

namespace App\Providers;

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
        // On Railway the persistent volume is mounted at /app/storage/app.
        // A fresh volume starts empty, which hides the public/ symlink target
        // of `storage:link`, so make sure the folder exists on boot.
        $publicDir = storage_path('app/public');
        if (! is_dir($publicDir)) {
            @mkdir($publicDir, 0775, true);
        }
    }
}
