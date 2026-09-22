<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Homelie extends Model
{
    protected $fillable = [
        'title', 'slug', 'priest', 'readings', 'sunday', 'duration',
        'excerpt', 'img', 'published_at', 'audio_url', 'pdf_url', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_published' => 'boolean',
        ];
    }
}
