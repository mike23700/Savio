<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IntentionMesse extends Model
{
    protected $table = 'intentions_messe';

    protected $fillable = ['user_id', 'nom', 'prenom', 'email', 'telephone', 'description', 'date_souhaitee', 'statut'];
}
