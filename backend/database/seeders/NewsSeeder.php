<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['Catéchèse', '#D4AF37'],
            ['Caritas', '#D4AF37'],
            ['Vie paroissiale', '#0B3D91'],
            ['Général', '#6b7280'],
            ['Annonces', '#6b7280'],
            ['Méditation', '#0B3D91'],
        ];

        $ids = [];
        foreach ($categories as $i => [$name, $color]) {
            $ids[$name] = NewsCategory::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'color' => $color, 'sort_order' => $i],
            )->id;
        }

        $articles = [
            [
                'category' => 'Catéchèse',
                'title' => 'Inscriptions ouvertes pour la catéchèse 2026–2027',
                'published_at' => '2026-09-12 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1774685398923-ba001b371579?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'Les inscriptions pour la catéchèse des enfants, des jeunes et des adultes sont désormais ouvertes pour l\'année 2026–2027. Venez nous rejoindre au secrétariat paroissial pour plus d\'informations.',
                'content' => 'La paroisse Saint Dominique Savio est heureuse d\'annoncer l\'ouverture des inscriptions pour la catéchèse 2026–2027.

Nous proposons des programmes adaptés à tous les âges :

• **Catéchèse des enfants** (7–12 ans) : éveil à la foi, préparation aux sacrements
• **Catéchèse des jeunes** (13–18 ans) : approfondissement de la foi, confirmation
• **Catéchèse des adultes** : parcours biblique, initiation chrétienne (RICA)

Les inscriptions se font au secrétariat paroissial du lundi au vendredi de 8h à 13h et de 15h30 à 18h30.

Des documents sont requis : acte de baptême, carte d\'identité des parents, photo d\'identité.',
            ],
            [
                'category' => 'Caritas',
                'title' => 'Opération rentrée scolaire : ensemble pour nos enfants',
                'published_at' => '2026-09-10 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'La Caritas paroissiale lance son opération de rentrée scolaire 2026/2027 en faveur des familles défavorisées de notre communauté.',
                'content' => 'La Caritas de la paroisse Saint Dominique Savio organise son opération de rentrée scolaire 2026/2027.

Dans le cadre de sa mission de solidarité, notre Caritas paroissiale se mobilise pour aider les familles défavorisées à scolariser leurs enfants. Des fournitures scolaires, des uniformes et des contributions aux frais de scolarité seront distribués aux familles bénéficiaires.

Comment participer ?
• **Faire un don** en espèces au secrétariat
• **Offrir des fournitures** scolaires neuves
• **Se porter volontaire** pour la distribution

Les familles bénéficiaires doivent se présenter au secrétariat avec une pièce d\'identité et un justificatif de résidence.',
            ],
            [
                'category' => 'Vie paroissiale',
                'title' => 'Neuvaine à Marie qui défait les nœuds',
                'published_at' => '2026-09-08 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'Clôture du mois du Cœur Immaculé de Marie avec la neuvaine à Notre-Dame qui défait les nœuds. Rejoignez-nous chaque soir à 18h30.',
                'content' => 'La paroisse organise la neuvaine à Marie qui défait les nœuds pour clôturer le mois du Cœur Immaculé de Marie.

Cette dévotion, popularisée par le Pape François, consiste en neuf jours de prière intensive pour confier à la Vierge Marie les situations difficiles de nos vies.

**Programme de la neuvaine :**
• Chapelet à 18h00
• Méditation et prière de la neuvaine à 18h30
• Bénédiction finale

Toute la communauté paroissiale est invitée à participer à ces temps de prière. Venez avec vos intentions particulières.',
            ],
            [
                'category' => 'Général',
                'title' => 'Journée de prière pour la paix dans le monde',
                'published_at' => '2026-09-05 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'À l\'initiative de l\'Archidiocèse de Douala, notre paroisse participe à la journée de prière pour la paix dans le monde.',
                'content' => 'Sur invitation de l\'Archidiocèse de Douala, la paroisse Saint Dominique Savio s\'unit à toute l\'Église universelle pour une journée de prière pour la paix dans le monde.

Cette journée se déroulera avec un programme spirituel intense :

• 06h30 : Messe d\'intention pour la paix
• 09h00 : Chapelet mondial en communion avec toutes les paroisses
• 15h00 : Via Crucis pour la paix
• 18h30 : Vêpres et bénédiction du Saint-Sacrement

« Heureux les artisans de paix, car ils seront appelés fils de Dieu. » (Mt 5,9)',
            ],
            [
                'category' => 'Annonces',
                'title' => 'Service de nettoyage de l\'église : CEV Notre Dame',
                'published_at' => '2026-08-24 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'Le service de nettoyage de l\'église pour la semaine du 24 au 29 août est assuré par la CEV Notre Dame de l\'Immaculée Conception.',
                'content' => 'Le service hebdomadaire de nettoyage de notre église est assuré en rotation par les différentes Communautés Ecclésiales Vivantes (CEV) de la paroisse.

Pour la semaine du 24 au 29 août 2026, c\'est la CEV Notre Dame de l\'Immaculée Conception qui est chargée du nettoyage.

Nous remercions tous les membres qui contribuent généreusement de leur temps pour maintenir notre église propre et accueillante pour tous. C\'est un service précieux rendu à toute la communauté.

Le calendrier complet des services est disponible au secrétariat paroissial.',
            ],
            [
                'category' => 'Méditation',
                'title' => 'Retraite spirituelle pour les jeunes – Octobre 2026',
                'published_at' => '2026-09-01 09:00:00',
                'img' => 'https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=800&h=450&fit=crop&auto=format',
                'excerpt' => 'Une retraite spirituelle de trois jours est organisée pour les jeunes de la paroisse en octobre 2026. Inscriptions ouvertes.',
                'content' => 'La paroisse Saint Dominique Savio organise une retraite spirituelle pour les jeunes du 10 au 12 octobre 2026.

Sous le thème « Enracinés dans le Christ », cette retraite de trois jours proposera :

• Des temps de prière et d\'adoration
• Des conférences animées par le Père curé
• Des partages en groupes
• Une veillée de prière
• La célébration de l\'Eucharistie

**Lieu :** Centre spirituel de Bonabéri
**Coût de participation :** 15 000 FCFA (repas et hébergement inclus)

Inscriptions au secrétariat avant le 30 septembre 2026.',
            ],
        ];

        foreach ($articles as $a) {
            News::updateOrCreate(
                ['slug' => Str::slug($a['title'])],
                [
                    'news_category_id' => $ids[$a['category']],
                    'title' => $a['title'],
                    'excerpt' => $a['excerpt'],
                    'content' => $a['content'],
                    'img' => $a['img'],
                    'published_at' => $a['published_at'],
                    'is_published' => true,
                ],
            );
        }
    }
}
