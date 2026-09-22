<?php

namespace Database\Seeders;

use App\Models\Mouvement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MouvementSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Conseils
            [
                'category' => 'conseil', 'icon' => '🏛️', 'title' => 'Conseil Pastoral',
                'description' => "Le Conseil Pastoral réunit le clergé et les représentants laïcs de la paroisse. Il examine les besoins d'évangélisation de la communauté et propose des orientations pour la vie paroissiale. Il est présidé par le curé.",
                'details' => ['Réunit clergé et représentants laïcs', "Examine les besoins d'évangélisation", 'Propose des orientations pastorales', 'Présidé par le curé'],
            ],
            [
                'category' => 'conseil', 'icon' => '💰', 'title' => 'Conseil des Affaires Économiques',
                'description' => "Le Conseil des Affaires Économiques assure la gestion des biens et finances paroissiaux. Il est un signe de la mission de l'Église et garantit la transparence et la bonne gestion des ressources au service de la communauté.",
                'details' => ['Gestion des biens paroissiaux', 'Suivi des finances', 'Transparence et bonne gestion', "Service de la mission de l'Église"],
            ],
            // Mouvements
            ['category' => 'mouvement', 'icon' => '👨‍👩‍👧', 'title' => 'Mouvements adultes', 'description' => "Groupes pour les adultes de la paroisse souhaitant approfondir leur foi et s'engager au service de la communauté.", 'color' => '#0B3D91', 'details' => []],
            ['category' => 'mouvement', 'icon' => '👦', 'title' => 'Mouvements jeunes', 'description' => "Groupes pour les jeunes de la paroisse : scouts, JEC, MJC et autres mouvements d'apostolat jeunesse.", 'color' => '#D4AF37', 'details' => []],
            ['category' => 'mouvement', 'icon' => '✝️', 'title' => 'Groupes liturgiques', 'description' => 'Au service de la liturgie paroissiale : servants de messe, lecteurs, chantres et autres ministres.', 'color' => '#0B3D91', 'details' => []],
            ['category' => 'mouvement', 'icon' => '🌍', 'title' => 'Communautés du Grand Nord', 'description' => 'Communauté originaire du Nord-Cameroun, unie dans la foi et la fraternité au sein de notre paroisse.', 'color' => '#D4AF37', 'details' => []],
            // Chorales
            [
                'category' => 'chorale', 'icon' => '🎵', 'title' => 'Le chant liturgique',
                'description' => 'La chorale paroissiale est un ensemble vocal dont les membres — les choristes — chantent collectivement les différentes parties musicales de la liturgie.',
                'content' => "La chorale paroissiale est un ensemble vocal dont les membres — les choristes — chantent collectivement les différentes parties musicales de la liturgie. Par leur service, ils embellissent les célébrations et aident l'assemblée à prier et louer Dieu.\n\n🎵 Rejoindre une chorale : Toute personne aimant le chant est la bienvenue. Les répétitions ont lieu en semaine. Renseignez-vous au secrétariat paroissial.",
                'details' => [],
            ],
            ['category' => 'chorale', 'icon' => '🎼', 'title' => 'Chorale principale', 'description' => 'Anime la messe de 11h00 et les grandes fêtes liturgiques.', 'details' => []],
            ['category' => 'chorale', 'icon' => '🎹', 'title' => 'Chorale des jeunes', 'description' => 'Animent les messes dominicales du soir et les rassemblements jeunesse.', 'details' => []],
            ['category' => 'chorale', 'icon' => '🎸', 'title' => 'Schola grégorienne', 'description' => 'Chant grégorien et musique sacrée classique pour les occasions spéciales.', 'details' => []],
            // CEV
            ['category' => 'cev', 'icon' => '🙏', 'title' => 'Prière communautaire', 'description' => 'Chapelet, lecture de la Parole, partage en petits groupes.', 'details' => []],
            ['category' => 'cev', 'icon' => '❤️', 'title' => 'Solidarité', 'description' => 'Entraide entre membres, visite des malades et des personnes seules.', 'details' => []],
            ['category' => 'cev', 'icon' => '📖', 'title' => 'Formation', 'description' => 'Lecture et partage de la Parole de Dieu en contexte local.', 'details' => []],
            ['category' => 'cev', 'icon' => '🌿', 'title' => 'Évangélisation', 'description' => 'Témoignage et annonce de l\'Évangile dans le quartier.', 'details' => []],
        ];

        foreach ($items as $i => $item) {
            $details = $item['details'];
            unset($item['details']);
            $item['slug'] = Str::slug($item['title']);
            $item['sort_order'] = $i;

            $mouvement = Mouvement::updateOrCreate(['slug' => $item['slug']], $item);
            $mouvement->details()->delete();
            foreach (array_values($details) as $j => $detail) {
                $mouvement->details()->create(['detail' => $detail, 'sort_order' => $j]);
            }
        }
    }
}
