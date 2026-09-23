<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaItem extends Model
{
    protected $fillable = [
        'type', 'media_category_id', 'title', 'image', 'youtube_url', 'youtube_id', 'taken_at', 'sort_order', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'taken_at' => 'date:Y-m-d',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MediaCategory::class, 'media_category_id');
    }

    /**
     * Extract the 11-char video id from any usual YouTube link
     * (watch?v=, youtu.be/, embed/, shorts/, live/) or a bare id.
     */
    public static function youtubeId(?string $url): ?string
    {
        if (! $url) {
            return null;
        }
        $url = trim($url);
        if (preg_match('/^[A-Za-z0-9_-]{11}$/', $url)) {
            return $url;
        }
        if (preg_match('#(?:youtube(?:-nocookie)?\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/|v/)|youtu\.be/)([A-Za-z0-9_-]{11})#', $url, $m)) {
            return $m[1];
        }

        return null;
    }
}
