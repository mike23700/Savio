<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A bookable space: a guest room of the welcome centre (`kind = chambre`,
 * priced per night) or a hall rented for events (`kind = salle`, priced per
 * day). `quantite` identical units can be booked on the same dates; a null
 * `prix` means the price is given on request (booking without online payment).
 */
class Espace extends Model
{
    protected $fillable = [
        'kind', 'nom', 'slug', 'resume', 'description', 'capacite', 'quantite',
        'prix', 'equipements', 'photos', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'equipements' => 'array',
            'photos' => 'array',
            'is_active' => 'boolean',
            'prix' => 'integer',
            'capacite' => 'integer',
            'quantite' => 'integer',
        ];
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function isChambre(): bool
    {
        return $this->kind === 'chambre';
    }

    public function hasPrice(): bool
    {
        return (int) $this->prix > 0;
    }
}
