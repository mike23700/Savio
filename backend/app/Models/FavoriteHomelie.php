<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteHomelie extends Model
{
    protected $fillable = ['user_id', 'homelie_id'];
}
