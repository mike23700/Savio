<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:8443')],

    // Vercel génère un sous-domaine par déploiement (savio-rho.vercel.app,
    // savio-abc123-takou.vercel.app…) : on les autorise tous par motif
    // wildcard (Str::is), '*' matchant n'importe quelle suite de caractères.
    'allowed_origins_patterns' => [env('FRONTEND_ORIGIN_PATTERN', 'https://savio-*.vercel.app')],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
