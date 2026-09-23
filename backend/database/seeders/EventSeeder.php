<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['Messe', '#0B3D91'],
            ['Sacrement', '#D4AF37'],
            ['Adoration', '#7c3aed'],
            ['Catéchèse', '#059669'],
            ['Communauté', '#d97706'],
            ['Spiritualité', '#dc2626'],
        ];

        $ids = [];
        foreach ($categories as $i => [$name, $color]) {
            $ids[$name] = EventCategory::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'color' => $color, 'sort_order' => $i],
            )->id;
        }

        // Starter events (the agenda previously hard-coded in src/data/content.ts).
        $events = [
            ['2026-09-14', '07:00', 'Messe dominicale', 'Messe', 'Église principale'],
            ['2026-09-14', '09:00', 'Messe dominicale', 'Messe', 'Église principale'],
            ['2026-09-14', '11:00', 'Messe principale', 'Messe', 'Église principale'],
            ['2026-09-14', '18:30', 'Messe du soir', 'Messe', 'Église principale'],
            ['2026-09-15', '06:30', 'Messe quotidienne + Adoration', 'Messe', 'Église principale'],
            ['2026-09-17', '07:15', 'Adoration (journée)', 'Adoration', 'Église principale'],
            ['2026-09-17', '17:00', 'Confessions', 'Sacrement', 'Confessionnaux'],
            ['2026-09-19', '18:30', 'Messe des malades', 'Messe', 'Église principale'],
            ['2026-09-20', '15:00', 'Réunion CEV Saint-Joseph', 'Communauté', 'Salle paroissiale'],
            ['2026-09-21', '09:00', 'Catéchèse des enfants', 'Catéchèse', 'Salles de catéchèse'],
            ['2026-09-26', '09:00', 'Baptêmes d\'enfants', 'Sacrement', 'Fonts baptismaux'],
            ['2026-09-28', '10:00', 'Assemblée paroissiale', 'Communauté', 'Grande salle'],
            ['2026-10-10', '08:00', 'Retraite spirituelle des jeunes (Jour 1)', 'Spiritualité', 'Centre de Bonabéri'],
            ['2026-10-11', '08:00', 'Retraite spirituelle des jeunes (Jour 2)', 'Spiritualité', 'Centre de Bonabéri'],
            ['2026-10-12', '08:00', 'Retraite spirituelle des jeunes (Jour 3)', 'Spiritualité', 'Centre de Bonabéri'],
        ];

        foreach ($events as [$date, $time, $title, $cat, $location]) {
            Event::updateOrCreate(
                ['date' => $date, 'time' => $time, 'title' => $title],
                ['event_category_id' => $ids[$cat], 'location' => $location, 'is_published' => true],
            );
        }
    }
}
