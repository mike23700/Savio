<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Projet extends Model
{
    protected $fillable = ['titre', 'slug', 'description', 'statut', 'objectif', 'collecte', 'image', 'details', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ProjetPhoto::class)->orderBy('sort_order');
    }
}
