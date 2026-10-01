<?php

namespace Database\Seeders;

use App\Models\Concerns\RecordsAccountingEntry;
use App\Models\Donation;
use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

/**
 * Replays the payment → accounting ledger link (see RecordsAccountingEntry) over
 * every payable table, so payments confirmed before the link existed show up in the
 * admin "Comptabilité" screen. Idempotent: paid records get their line created or
 * refreshed, the others have any stale line removed.
 */
class AccountingBackfillSeeder extends Seeder
{
    public function run(): void
    {
        $total = 0;

        foreach ($this->sources() as $label => $class) {
            $payes = 0;

            $class::query()->with($this->relationsFor($class))->each(function (Model $record) use (&$payes) {
                /** @var Model&RecordsAccountingEntry $record */
                $record->syncAccountingEntry();
                if ($record->payment_status === 'paye') {
                    $payes++;
                }
            });

            $total += $payes;
            $this->command->info("  {$label} : {$payes} paiement(s) confirmé(s)");
        }

        $this->command->info("Comptabilité synchronisée : {$total} ligne(s) reflétée(s).");
    }

    /** @return array<string, class-string<Model>> */
    private function sources(): array
    {
        return [
            'Dons' => Donation::class,
            'Commandes boutique' => Order::class,
            'Réservations' => Reservation::class,
        ];
    }

    /** @return list<string> */
    private function relationsFor(string $class): array
    {
        return match ($class) {
            Donation::class => ['user:id,nom,prenom', 'projet:id,titre'],
            Order::class => ['items:order_id,product_nom_snapshot,qty'],
            Reservation::class => ['espace:id,nom,kind'],
            default => [],
        };
    }
}
