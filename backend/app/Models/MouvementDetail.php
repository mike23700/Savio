<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementDetail extends Model
{
    protected $fillable = ['mouvement_id', 'detail', 'sort_order'];
}
