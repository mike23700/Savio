<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RegistreInscription extends Model
{
    protected $fillable = [
        'user_id',
        'nom', 'prenom', 'email', 'telephone', 'tranche_age', 'rue', 'quartier', 'lieu_dit',
        'membre_cev', 'quelle_cev', 'membre_groupe', 'quel_groupe', 'anciennete', 'source', 'created_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'membre_cev' => 'boolean',
            'membre_groupe' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sacrements(): HasMany
    {
        return $this->hasMany(RegistreSacrement::class, 'registre_inscription_id');
    }

    public function printRequests(): HasMany
    {
        return $this->hasMany(RegistrePrintRequest::class, 'registre_inscription_id');
    }
}
