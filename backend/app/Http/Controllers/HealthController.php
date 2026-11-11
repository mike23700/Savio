<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Small JSON response for the API root, so https://api.example.com/ answers
 * with something useful instead of the default Laravel welcome page.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'name' => config('app.name'),
            'status' => 'ok',
        ]);
    }
}
