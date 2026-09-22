<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SacrementDetail extends Model
{
    protected $fillable = ['sacrement_id', 'detail', 'sort_order'];
}
