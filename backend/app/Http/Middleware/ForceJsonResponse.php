<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * API routes always speak JSON.
 *
 * Without this, an unauthenticated request that does not explicitly send
 * "Accept: application/json" makes Laravel's Authenticate middleware look for
 * a web "login" route (which does not exist in this API-only app) and return
 * a 500 instead of a clean 401.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/*')) {
            $request->headers->set('Accept', 'application/json');
        }

        return $next($request);
    }
}
