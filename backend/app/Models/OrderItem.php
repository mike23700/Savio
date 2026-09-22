<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'product_id', 'product_nom_snapshot', 'prix_unitaire', 'qty', 'subtotal'];
}
