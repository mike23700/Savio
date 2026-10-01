<?php

namespace App\Models\Concerns;

use App\Models\Transaction;
use App\Models\TransactionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Mirrors a paid payment into the parish accounting ledger (transactions) shown in
 * the admin "Comptabilité" screen. Used by every payable model (Order, Donation,
 * Reservation).
 *
 * A line only ever exists while payment_status is "paye", so nothing reaches the
 * ledger before the payment is actually confirmed — whether that confirmation comes
 * from an admin, the Peex webhook or payment polling. All three end in a save() on
 * the payable, hence the saved() hook.
 *
 * The line is keyed by source_type/source_id, so flipping a payment back and forth
 * refreshes the same row instead of duplicating it.
 */
trait RecordsAccountingEntry
{
    public static function bootRecordsAccountingEntry(): void
    {
        static::saved(function (Model $model) {
            if ($model->wasChanged('payment_status')) {
                $model->syncAccountingEntry();
            }
        });
    }

    /**
     * Create, refresh or remove this record's line in the accounting ledger.
     * Idempotent and safe to call on a record that is not paid (the removal is a
     * no-op), which lets AccountingBackfillSeeder replay it over whole tables.
     */
    public function syncAccountingEntry(): void
    {
        $source = ['source_type' => $this->accountingSourceType(), 'source_id' => $this->getKey()];
        $query = Transaction::where($source);
        $amount = $this->payment_status === 'paye' ? $this->accountingAmount() : null;

        // Nothing to record: not paid, or a quote with no price (sur devis). Any
        // previously recorded line is dropped so it cannot linger.
        if ($amount === null || $amount <= 0) {
            $query->delete();

            return;
        }

        $attributes = [
            'type' => 'entree',
            'libelle' => $this->accountingLibelle(),
            'montant' => $amount,
            'date' => $this->accountingDate(),
            'reference' => $this->payment_reference,
            'notes' => $this->accountingNotes(),
        ];

        $existing = $query->first();
        if ($existing) {
            // Category left untouched: the parish may have re-filed the line by hand.
            $existing->update($attributes);

            return;
        }

        // Builder::create() does not carry the where clauses over, so the source
        // columns are passed explicitly.
        Transaction::create($attributes + $source + [
            'transaction_category_id' => $this->accountingCategoryId(),
        ]);
    }

    /** Value used in transactions.source_type, e.g. "donation", "order", "reservation". */
    protected function accountingSourceType(): string
    {
        return Str::snake(class_basename(static::class));
    }

    /** Amount received, or null when there is nothing to record (e.g. a quote). */
    abstract protected function accountingAmount(): ?int;

    /** Accounting date: the day the payment was confirmed, else the record's creation day. */
    protected function accountingDate(): string
    {
        return ($this->confirmed_at ?? $this->created_at)->format('Y-m-d');
    }

    /**
     * Names of the income categories this source files under; the first existing one
     * wins, so a parish that renames or deletes a category still gets correct lines
     * (recorded without a category) instead of a broken reference.
     *
     * @return list<string>
     */
    protected function accountingCategoryNames(): array
    {
        return [];
    }

    abstract protected function accountingLibelle(): string;

    protected function accountingNotes(): ?string
    {
        return null;
    }

    private function accountingCategoryId(): ?int
    {
        $names = $this->accountingCategoryNames();
        if ($names === []) {
            return null;
        }

        return TransactionCategory::where('type', 'entree')->whereIn('name', $names)->value('id');
    }
}
