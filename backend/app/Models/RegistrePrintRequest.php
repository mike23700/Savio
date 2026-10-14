<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistrePrintRequest extends Model
{
    public const STATUTS = ['en_attente', 'en_traitement', 'prete', 'livree', 'refusee'];

    protected $fillable = [
        'reference', 'registre_inscription_id', 'user_id', 'statut',
        'message', 'admin_notes', 'processed_by_user_id', 'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'processed_at' => 'datetime',
        ];
    }

    public function inscription(): BelongsTo
    {
        return $this->belongsTo(RegistreInscription::class, 'registre_inscription_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by_user_id');
    }
}
