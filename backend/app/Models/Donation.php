<?php

namespace App\Models;

use App\Models\Concerns\RecordsAccountingEntry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use RecordsAccountingEntry;

    protected $fillable = [
        'user_id', 'projet_id', 'montant', 'payment_method', 'telephone', 'payment_status', 'intention',
        'payment_reference', 'payment_provider', 'payment_provider_status', 'payment_details',
        'confirmed_by_user_id', 'confirmed_at',
    ];

    protected function casts(): array
    {
        return ['confirmed_at' => 'datetime', 'montant' => 'integer'];
    }

    /**
     * A paid donation to a project feeds its progress bar (`projets.collecte`).
     * Handled here so every path that changes payment_status (Peex webhook,
     * polling, admin panel) keeps the total in sync; `collecte` can still be
     * edited by hand in the admin for offline gifts.
     */
    protected static function booted(): void
    {
        static::saved(function (Donation $donation) {
            if (! $donation->projet_id || ! $donation->wasChanged('payment_status')) {
                return;
            }

            $wasPaid = $donation->getOriginal('payment_status') === 'paye';
            $isPaid = $donation->payment_status === 'paye';

            if ($isPaid && ! $wasPaid) {
                Projet::whereKey($donation->projet_id)->increment('collecte', $donation->montant);
            } elseif ($wasPaid && ! $isPaid) {
                Projet::whereKey($donation->projet_id)->decrement('collecte', $donation->montant);
            }
        });
    }

    protected function accountingAmount(): ?int
    {
        return (int) $this->montant;
    }

    protected function accountingLibelle(): string
    {
        $this->loadMissing('user:id,nom,prenom');

        return 'Don — ' . $this->paymentCustomerName() . ($this->intention ? " ({$this->intention})" : '');
    }

    protected function accountingCategoryNames(): array
    {
        return ['Dons et offrandes', 'Quêtes'];
    }

    protected function accountingNotes(): ?string
    {
        $this->loadMissing('projet:id,titre');

        return $this->projet ? "Projet : {$this->projet->titre}" : null;
    }

    public function projet(): BelongsTo
    {
        return $this->belongsTo(Projet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentAmount(): float
    {
        return (float) $this->montant;
    }

    public function paymentCustomerName(): string
    {
        return trim(($this->user?->prenom ?? '') . ' ' . ($this->user?->nom ?? '')) ?: 'Donateur';
    }

    public function paymentDescription(): string
    {
        return $this->projet ? "Don projet : {$this->projet->titre}" : 'Don paroisse Saint Dominique Savio';
    }
}
