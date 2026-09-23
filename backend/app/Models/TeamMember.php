<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'slug', 'name', 'role', 'photo', 'since', 'origin', 'bio', 'motto', 'email',
        'born', 'ordained', 'ordained_by', 'ministries', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'ministries' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
