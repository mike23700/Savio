<?php

namespace Database\Seeders;

use App\Models\JournalIssue;
use Illuminate\Database\Seeder;

class JournalIssueSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['numero' => 'N°38', 'theme' => 'Fête de la Croix Glorieuse', 'published_at' => '2026-09-15'],
            ['numero' => 'N°37', 'theme' => 'Nativité de la Vierge Marie', 'published_at' => '2026-09-08'],
            ['numero' => 'N°36', 'theme' => '22e dimanche du Temps ordinaire', 'published_at' => '2026-09-01'],
        ];

        foreach ($items as $item) {
            JournalIssue::updateOrCreate(['numero' => $item['numero']], $item);
        }
    }
}
