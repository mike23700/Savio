<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    /** A mobile money attempt left unvalidated this long stops holding the dates. */
    public const PENDING_HOLD_MINUTES = 60;

    protected $fillable = [
        'reference', 'espace_id', 'user_id', 'nom', 'prenom', 'email', 'telephone',
        'date_debut', 'date_fin', 'nb_unites', 'nb_personnes', 'evenement', 'message',
        'montant', 'payment_method', 'payment_status', 'payment_reference', 'payment_provider',
        'payment_provider_status', 'payment_details', 'statut', 'confirmed_by_user_id',
        'confirmed_at', 'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date:Y-m-d',
            'date_fin' => 'date:Y-m-d',
            'confirmed_at' => 'datetime',
            'montant' => 'integer',
            'nb_unites' => 'integer',
            'nb_personnes' => 'integer',
        ];
    }

    public function espace(): BelongsTo
    {
        return $this->belongsTo(Espace::class);
    }

    /**
     * Reservations that currently hold their dates: not cancelled, payment not
     * failed/cancelled, and not an abandoned mobile money attempt.
     */
    public function scopeHoldingDates(Builder $query): Builder
    {
        return $query
            ->where('statut', '!=', 'annulee')
            ->whereNotIn('payment_status', ['echoue', 'annule'])
            ->where(fn (Builder $q) => $q
                ->where('payment_provider', '!=', 'peex')
                ->orWhereNull('payment_provider')
                ->orWhere('payment_status', 'paye')
                ->orWhere('statut', 'confirmee')
                ->orWhere('created_at', '>=', now()->subMinutes(self::PENDING_HOLD_MINUTES)));
    }

    /**
     * Calendar days occupied, as "Y-m-d": a room is free again on the
     * departure day, a hall is booked up to and including its last day.
     *
     * @return list<string>
     */
    public static function occupiedDays(string $kind, Carbon $debut, Carbon $fin): array
    {
        $end = $kind === 'chambre' ? $fin->copy()->subDay() : $fin->copy();
        if ($end->lt($debut)) {
            return [];
        }

        return collect(CarbonPeriod::create($debut->copy()->startOfDay(), $end->startOfDay()))
            ->map(fn (Carbon $d) => $d->toDateString())
            ->all();
    }

    public function paymentAmount(): float
    {
        return (float) $this->montant;
    }

    public function paymentCustomerName(): string
    {
        return trim("{$this->prenom} {$this->nom}");
    }

    public function paymentDescription(): string
    {
        return 'Réservation ' . ($this->espace?->nom ?? '') . " ({$this->reference})";
    }
}
