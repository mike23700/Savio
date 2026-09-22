<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatecheseInscription extends Model
{
    protected $fillable = ['user_id', 'nom', 'prenom', 'email', 'telephone', 'niveau_id', 'age', 'statut'];

    public function niveau()
    {
        return $this->belongsTo(CatecheseNiveau::class, 'niveau_id');
    }
}
