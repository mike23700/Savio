<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistreInscription extends Model
{
    protected $fillable = [
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
}
