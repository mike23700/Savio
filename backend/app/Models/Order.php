<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'nom', 'prenom', 'email', 'telephone', 'total',
        'payment_method', 'payment_status', 'order_status', 'payment_reference',
        'confirmed_by_user_id', 'confirmed_at', 'notes',
    ];

    protected function casts(): array
    {
        return ['confirmed_at' => 'datetime'];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
