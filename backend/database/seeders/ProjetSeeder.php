<?php

namespace Database\Seeders;

use App\Models\Projet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProjetSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['titre' => "Rénovation de l'église principale", 'description' => 'Travaux de rénovation de la toiture, des vitraux et de la façade de notre église.', 'statut' => 'en_cours', 'objectif' => 15000000, 'collecte' => 9200000, 'image' => 'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=600&h=400&fit=crop&auto=format', 'details' => "Ce projet vise à restaurer notre église afin d'assurer sa pérennité pour les générations futures. Les travaux concernent principalement la toiture, les vitraux et la façade extérieure. La rénovation permettra également d'améliorer l'acoustique de l'église pour les célébrations liturgiques."],
            ['titre' => 'Construction de salles de catéchèse', 'description' => 'Construction de 4 nouvelles salles pour accueillir les enfants de catéchèse dans de meilleures conditions.', 'statut' => 'en_cours', 'objectif' => 8000000, 'collecte' => 3500000, 'image' => 'https://images.unsplash.com/photo-1774685398923-ba001b371579?w=600&h=400&fit=crop&auto=format', 'details' => "Le nombre croissant d'enfants inscrits à la catéchèse nécessite la construction de nouvelles salles. Ce projet prévoit 4 salles polyvalentes équipées, pouvant accueillir 30 enfants chacune. Les salles seront également utilisées pour les réunions de mouvements et les formations."],
            ['titre' => "Forage d'eau", 'description' => 'Installation d\'un forage pour approvisionner la paroisse et les familles environnantes en eau potable.', 'statut' => 'termine', 'objectif' => 5000000, 'collecte' => 5000000, 'image' => 'https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=600&h=400&fit=crop&auto=format', 'details' => 'Le projet de forage a été réalisé avec succès. La paroisse dispose maintenant d\'une source d\'eau potable accessible à tous, bénéficiant à l\'ensemble de la communauté paroissiale et aux familles environnantes. Ce projet a été financé grâce à la générosité de nos paroissiens.'],
            ['titre' => 'Salle multifonctionnelle', 'description' => 'Construction d\'une grande salle pour les réunions, fêtes paroissiales et activités communautaires.', 'statut' => 'en_cours', 'objectif' => 20000000, 'collecte' => 4800000, 'image' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=600&h=400&fit=crop&auto=format', 'details' => 'Cette salle multifonctionnelle accueillera les grandes réunions paroissiales, les fêtes communautaires, les formations et les activités culturelles. D\'une capacité de 500 personnes, elle sera équipée d\'une cuisine, de sanitaires et d\'un système audiovisuel moderne.'],
            ['titre' => 'Grotte Mariale', 'description' => 'Rénovation et embellissement de la grotte mariale pour la prière et les pèlerinages.', 'statut' => 'termine', 'objectif' => 3000000, 'collecte' => 3000000, 'image' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=600&h=400&fit=crop&auto=format', 'details' => 'La grotte mariale a été entièrement rénovée : nouvelle toiture, éclairage, aménagement paysager et chemin d\'accès. Ce lieu de prière est désormais accessible à tous et accueille régulièrement des célébrations mariales et des groupes de prière.'],
        ];

        foreach ($items as $i => $item) {
            $item['slug'] = Str::slug($item['titre']);
            $item['sort_order'] = $i;
            Projet::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
