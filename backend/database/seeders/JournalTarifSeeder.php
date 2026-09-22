<?php

namespace Database\Seeders;

use App\Models\JournalTarif;
use Illuminate\Database\Seeder;

class JournalTarifSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'Mensuel', 'price_label' => '500 FCFA', 'issues' => 4, 'period' => '1 mois'],
            ['label' => 'Trimestriel', 'price_label' => '1 500 FCFA', 'issues' => 12, 'period' => '3 mois'],
            ['label' => 'Semestriel', 'price_label' => '3 000 FCFA', 'issues' => 24, 'period' => '6 mois'],
            ['label' => 'Annuel', 'price_label' => '6 000 FCFA', 'issues' => 52, 'period' => '1 an'],
        ];

        foreach ($items as $i => $item) {
            $item['sort_order'] = $i;
            JournalTarif::updateOrCreate(['label' => $item['label']], $item);
        }
    }
}
