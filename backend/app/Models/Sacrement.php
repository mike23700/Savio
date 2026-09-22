<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sacrement extends Model
{
    protected $fillable = ['slug', 'icon', 'title', 'subtitle', 'description', 'img', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function details(): HasMany
    {
        return $this->hasMany(SacrementDetail::class)->orderBy('sort_order');
    }
}
