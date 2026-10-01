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

    // Liste blanche d'origines exactes (comparaison stricte, aucun regex).
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env(
            'FRONTEND_URL',
            'http://localhost:8443,http://localhost:5173,http://localhost:5180,http://127.0.0.1:5173,http://127.0.0.1:5180'
        ))
    ))),

    // Vercel génère un sous-domaine par déploiement (savio-rho.vercel.app,
    // savio-abc123-takou.vercel.app…) : on les autorise tous par motif.
    // ATTENTION : ces motifs sont des REGEX PCRE évalués par preg_match(),
    // ils doivent donc être delimiter (ici '#…#') — un motif de type
    // 'https://savio-*.vercel.app' sans délimiteur fait planter preg_match().
    'allowed_origins_patterns' => array_values(array_filter([
        env('FRONTEND_ORIGIN_PATTERN', '#^https://savio-[a-z0-9-]+\.vercel\.app$#i'),
    ])),

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
