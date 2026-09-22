<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MassSchedule extends Model
{
    protected $fillable = [
        'group_label', 'weekdays', 'recurrence_type', 'nth_week_of_month',
        'time', 'time_label', 'type', 'note', 'counts_as_mass', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weekdays' => 'array',
            'counts_as_mass' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
