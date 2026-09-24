<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // https://peex-api-docs.peexit.com/ — mobile money collection (Orange Money / MTN MoMo)
    'peex' => [
        'base_url' => env('PEEX_BASE_URL', 'https://sandbox.peexit.com/api/v1/'),
        'secret_key' => env('PEEX_SECRET_KEY'),
        'country' => env('PEEX_COUNTRY', 'CM'),
        'dial_code' => env('PEEX_DIAL_CODE', '237'),
        'currency' => env('PEEX_CURRENCY', 'XAF'),
        'timeout' => env('PEEX_TIMEOUT', 30),
        // Basic Auth credentials Peex uses when calling our webhook
        'callback_username' => env('PEEX_CALLBACK_USERNAME'),
        'callback_password' => env('PEEX_CALLBACK_PASSWORD'),
    ],

];
