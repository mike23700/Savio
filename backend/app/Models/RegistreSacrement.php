<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistreSacrement extends Model
{
    protected $fillable = [
        'registre_inscription_id', 'type', 'nom', 'sexe', 'pere', 'mere',
        'date_naissance', 'date_evenement', 'lieu', 'numero', 'numero_registre',
        'parrain_marraine', 'conjoint', 'baptise_a', 'temoins', 'ministre',
        'signataire', 'date_certificat', 'remarques', 'source', 'created_by_user_id',
    ];

    protected function casts(): array
    {
        return [
            'date_naissance' => 'date',
            'date_evenement' => 'date',
            'date_certificat' => 'date',
        ];
    }

    public function inscription(): BelongsTo
    {
        return $this->belongsTo(RegistreInscription::class, 'registre_inscription_id');
    }
}
