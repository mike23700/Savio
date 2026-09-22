<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function allAsMap(): array
    {
        return Cache::remember('settings.map', 60, function () {
            return static::query()->pluck('value', 'key')->toArray();
        });
    }

    public static function put(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget('settings.map');
    }
}
