<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageBlock extends Model
{
    protected $fillable = ['page_key', 'kind', 'title', 'subtitle', 'description', 'image', 'meta', 'icon', 'is_highlight', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_highlight' => 'boolean', 'is_active' => 'boolean'];
    }
}
