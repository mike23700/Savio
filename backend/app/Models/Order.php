<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'nom', 'prenom', 'email', 'telephone', 'total',
        'payment_method', 'payment_status', 'order_status', 'payment_reference',
        'payment_provider', 'payment_provider_status', 'payment_details',
        'confirmed_by_user_id', 'confirmed_at', 'notes',
    ];

    protected function casts(): array
    {
        return ['confirmed_at' => 'datetime', 'total' => 'integer'];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentAmount(): float
    {
        return (float) $this->total;
    }

    public function paymentCustomerName(): string
    {
        return trim("{$this->prenom} {$this->nom}");
    }

    public function paymentDescription(): string
    {
        return "Commande boutique {$this->order_number}";
    }
}
