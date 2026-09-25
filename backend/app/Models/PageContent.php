<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = ['key', 'title', 'subtitle', 'hero_image', 'intro', 'extra', 'is_active'];

    protected function casts(): array
    {
        return ['extra' => 'array', 'is_active' => 'boolean'];
    }

    public function blocks()
    {
        return $this->hasMany(PageBlock::class, 'page_key', 'key')->orderBy('sort_order');
    }
}
