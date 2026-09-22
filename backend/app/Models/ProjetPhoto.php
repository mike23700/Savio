<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjetPhoto extends Model
{
    protected $fillable = ['projet_id', 'url', 'sort_order'];
}
