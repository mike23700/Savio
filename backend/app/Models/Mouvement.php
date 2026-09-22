<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mouvement extends Model
{
    protected $fillable = ['category', 'slug', 'icon', 'title', 'description', 'content', 'color', 'image', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function details(): HasMany
    {
        return $this->hasMany(MouvementDetail::class)->orderBy('sort_order');
    }
}
