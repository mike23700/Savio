<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = ['event_category_id', 'title', 'date', 'time', 'location', 'description', 'is_published'];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }
}
