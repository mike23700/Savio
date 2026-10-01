<?php

namespace App\Models;

use App\Models\Concerns\RecordsAccountingEntry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use RecordsAccountingEntry;

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

    protected function accountingAmount(): ?int
    {
        return (int) $this->total;
    }

    protected function accountingLibelle(): string
    {
        return "Commande boutique {$this->order_number} — " . trim("{$this->prenom} {$this->nom}");
    }

    protected function accountingCategoryNames(): array
    {
        return ['Boutique et journal', 'Boutique'];
    }

    protected function accountingNotes(): ?string
    {
        // order_id must stay in the column list: a HasMany eager load matches the
        // children back to the parent on it, so omitting it yields an empty relation.
        $this->loadMissing('items:order_id,product_nom_snapshot,qty');

        $lines = $this->items->map(fn ($item) => "{$item->qty}× {$item->product_nom_snapshot}")->all();

        return $lines === [] ? null : implode(', ', $lines);
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
