<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DemandeSacrement extends Model
{
    protected $table = 'demandes_sacrement';

    protected $fillable = [
        'user_id', 'sacrement_id', 'sacrement_nom', 'nom', 'prenom', 'email',
        'telephone', 'personnes', 'message', 'statut',
    ];

    protected function casts(): array
    {
        return ['personnes' => 'array'];
    }

    public function sacrement(): BelongsTo
    {
        return $this->belongsTo(Sacrement::class);
    }
}
