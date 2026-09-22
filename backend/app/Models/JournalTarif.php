<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalTarif extends Model
{
    protected $fillable = ['label', 'price_label', 'issues', 'period', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}
