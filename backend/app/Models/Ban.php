<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ban extends Model
{
    protected $fillable = [
        'user_id',
        'nom', 'prenom', 'email', 'telephone',
        'fiance1_nom', 'fiance1_prenom', 'fiance1_age', 'fiance2_nom', 'fiance2_prenom', 'fiance2_age',
        'mariage_date', 'statut',
    ];

    protected $casts = [
        'mariage_date' => 'date',
    ];
}
