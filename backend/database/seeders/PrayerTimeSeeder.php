<?php

namespace Database\Seeders;

use App\Models\PrayerTime;
use Illuminate\Database\Seeder;

class PrayerTimeSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['icon' => '🕯️', 'title' => 'Adoration eucharistique', 'time_label' => "Lun–Ven après la messe de 06h30 jusqu'à 18h30", 'description' => 'Temps silencieux de contemplation devant le Saint-Sacrement exposé.'],
            ['icon' => '📿', 'title' => 'Chapelet', 'time_label' => 'Chaque soir à 18h00', 'description' => "Prière mariale en commun, suivie du partage sur l'Évangile du jour."],
            ['icon' => '🕊️', 'title' => 'Adoration nocturne', 'time_label' => 'Chaque lundi et 1er vendredi du mois', 'description' => 'Nuit de prière, louange et intercession pour la paroisse et le monde.'],
            ['icon' => '🙏', 'title' => 'Groupes de prière', 'time_label' => 'Selon le calendrier', 'description' => 'Différents groupes de prière se réunissent régulièrement dans la paroisse.'],
            ['icon' => '📖', 'title' => 'Lectio Divina', 'time_label' => 'Mercredi matin', 'description' => 'Lecture méditée de la Parole de Dieu, selon la méthode de la Lectio Divina.'],
            ['icon' => '✝️', 'title' => 'Chemin de croix', 'time_label' => 'Vendredi en Carême', 'description' => 'Prière du chemin de croix chaque vendredi pendant le temps de Carême.'],
        ];

        foreach ($items as $i => $item) {
            $item['sort_order'] = $i;
            PrayerTime::updateOrCreate(['title' => $item['title']], $item);
        }
    }
}
