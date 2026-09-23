<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyReading extends Model
{
    protected $fillable = ['date', 'liturgical_day', 'reading_1', 'psalm', 'reading_2', 'gospel', 'gospel_title'];

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }
}
