<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalSubscription extends Model
{
    protected $fillable = [
        'user_id', 'tarif_id', 'format', 'status', 'started_at', 'expires_at',
        'deactivated_by_user_id', 'deactivated_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'expires_at' => 'date',
            'deactivated_at' => 'datetime',
        ];
    }

    public function tarif()
    {
        return $this->belongsTo(JournalTarif::class, 'tarif_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
