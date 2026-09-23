<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'slug' => 'fankam-ngandjui',
                'name' => 'Abbé Jean-Robert FANKAM NGANDJUI',
                'role' => 'Curé de la paroisse',
                'photo_file' => 'pretre2.jpg',
                'since' => '2022',
                'origin' => 'Archidiocèse de Douala',
                'bio' => 'Abbé Jean-Robert Fankam Ngandjui est le curé en titre de la Paroisse Saint Dominique Savio. Prêtre de l\'Archidiocèse de Douala, il assure la direction pastorale de notre communauté avec dévouement. Il coordonne l\'ensemble des activités paroissiales, préside les célébrations eucharistiques dominicales et accompagne les fidèles dans leur cheminement spirituel.',
                'motto' => 'Que ma vie soit un témoignage vivant de l\'amour du Christ.',
                'email' => 'cure@paroissesaintdominiquesavio.com',
            ],
            [
                'slug' => 'kamga',
                'name' => 'Abbé Joseph Fotso KAMGA',
                'role' => 'Vicaire',
                'photo_file' => 'logo_savio.png',
                'since' => '2021',
                'origin' => 'Archidiocèse de Douala',
                'bio' => 'Abbé Joseph Fotso Kamga est vicaire à la Paroisse Saint Dominique Savio. Fort de nombreuses années de ministère presbytéral, il accompagne avec sagesse et expérience les fidèles et les différents groupes paroissiaux. Il est particulièrement engagé dans le soutien spirituel des aînés et des personnes malades.',
                'motto' => 'Servir avec humilité, aimer sans réserve.',
                'email' => 'vicariat@paroissesaintdominiquesavio.com',
            ],
            [
                'slug' => 'pandeu-tatsi',
                'name' => 'Abbé Achille Hermann PANDEU TATSI',
                'role' => 'Vicaire',
                'photo_file' => 'pretre1.jpg',
                'since' => '2023',
                'origin' => 'Archidiocèse de Douala',
                'bio' => 'Abbé Achille Hermann Pandeu Tatsi est vicaire à la paroisse. Dynamique et proche des jeunes, il anime la pastorale des jeunes, la catéchèse et les mouvements de jeunesse. Il s\'investit particulièrement dans la formation spirituelle et l\'accompagnement des lycéens et des étudiants.',
                'motto' => 'La jeunesse est le visage de demain ; donnons-lui l\'Évangile aujourd\'hui.',
                'email' => 'jeunesse@paroissesaintdominiquesavio.com',
            ],
            [
                'slug' => 'gwodog-tang',
                'name' => 'Abbé Simon Rodrigue GWODOG TANG',
                'role' => 'Vicaire',
                'photo_file' => 'pretre3.jpg',
                'since' => '2023',
                'origin' => 'Archidiocèse de Douala',
                'bio' => 'Abbé Simon Rodrigue Gwodog Tang est vicaire à la Paroisse Saint Dominique Savio. Il coordonne les célébrations liturgiques hebdomadaires, accompagne les communautés ecclésiales vivantes (CEV) et participe à l\'animation des temps forts liturgiques tout au long de l\'année.',
                'motto' => 'Annoncer le Christ ressuscité, voilà ma joie et ma mission.',
                'email' => 'liturgie@paroissesaintdominiquesavio.com',
            ],
            [
                'slug' => 'mbekou',
                'name' => 'Francis Hervé Duclair MBEKOU',
                'role' => 'Séminariste stagiaire',
                'photo_file' => 'pretre4.jpg',
                'since' => '2026',
                'origin' => 'Grand Séminaire de Yaoundé',
                'bio' => 'Francis Hervé Duclair Mbekou est séminariste en stage pastoral à la Paroisse Saint Dominique Savio. Dans le cadre de sa formation au sacerdoce, il participe activement à la vie paroissiale, à la catéchèse et aux différentes célébrations. Sa présence est un signe de l\'avenir de l\'Église.',
                'motto' => 'Me préparer chaque jour à être un serviteur de Dieu et de son peuple.',
                'email' => 'stage@paroissesaintdominiquesavio.com',
            ],
        ];

        foreach ($members as $i => $m) {
            $file = $m['photo_file'];
            unset($m['photo_file']);

            // Copy the bundled portrait into public storage so the admin can
            // later replace it like any uploaded image.
            $source = base_path('../src/imports/' . $file);
            $target = 'team/' . $m['slug'] . '.' . pathinfo($file, PATHINFO_EXTENSION);
            if (is_file($source) && ! Storage::disk('public')->exists($target)) {
                Storage::disk('public')->put($target, file_get_contents($source));
            }

            TeamMember::updateOrCreate(
                ['slug' => $m['slug']],
                [...$m, 'photo' => Storage::disk('public')->exists($target) ? $target : null, 'sort_order' => $i, 'is_active' => true],
            );
        }
    }
}
