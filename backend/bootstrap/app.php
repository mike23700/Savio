<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\StorageController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Infrastructure routes: no session/cookie middleware needed.
            Route::get('/', HealthController::class);
            Route::get('/storage/{path}', StorageController::class)->where('path', '.*');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);

        // No "login" page (API only): unauthenticated API calls get a JSON 401.
        $middleware->redirectGuestsTo(fn ($request) => $request->is('api/*') ? null : '/');

        // API error responses must be JSON even when the client omits Accept.
        $middleware->api(prepend: [
            \App\Http\Middleware\ForceJsonResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API only: always answer errors in JSON (401 instead of a redirect to a
        // non-existent "login" route, 422 instead of a redirect on validation).
        $exceptions->shouldRenderJsonWhen(
            fn ($request) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
