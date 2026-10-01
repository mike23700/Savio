<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** A cash movement of the parish: an income (entrée) or an expense (sortie). */
class Transaction extends Model
{
    protected $fillable = ['transaction_category_id', 'type', 'libelle', 'montant', 'date', 'reference', 'notes', 'source_type', 'source_id'];

    protected function casts(): array
    {
        return ['montant' => 'integer', 'date' => 'date:Y-m-d'];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TransactionCategory::class, 'transaction_category_id');
    }

    public function scopeEntrees(Builder $query): Builder
    {
        return $query->where('type', 'entree');
    }

    public function scopeSorties(Builder $query): Builder
    {
        return $query->where('type', 'sortie');
    }
}
