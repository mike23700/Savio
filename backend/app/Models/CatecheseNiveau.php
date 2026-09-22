<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatecheseNiveau extends Model
{
    protected $fillable = ['nom', 'age_label', 'icon', 'description', 'duree', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
