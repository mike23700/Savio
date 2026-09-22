<?php

namespace Database\Seeders;

use App\Models\Sacrement;
use Illuminate\Database\Seeder;

class SacrementSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug' => 'bapteme', 'icon' => '💧', 'title' => 'Baptême', 'subtitle' => 'Naître à la vie en Christ',
                'description' => "Le Baptême est le premier des sacrements, celui par lequel nous naissons à la vie divine et devenons membres de l'Église.",
                'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    "Baptêmes d'enfants : dernier samedi du mois à 9h00",
                    'Préparation obligatoire des parents (2 sessions)',
                    'Parrain et marraine catholiques pratiquants requis',
                    'Contact : secrétariat paroissial',
                ],
            ],
            [
                'slug' => 'mariage', 'icon' => '💍', 'title' => 'Mariage', 'subtitle' => 'L\'amour sanctifié par Dieu',
                'description' => "Le Mariage est le sacrement par lequel un homme et une femme s'unissent devant Dieu et l'Église pour fonder une famille chrétienne.",
                'img' => 'https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    'Publication des bans 3 semaines avant la cérémonie',
                    'Préparation au mariage obligatoire (session collective)',
                    'Entretien préalable avec le curé',
                    'Délai minimum : 6 mois avant la date souhaitée',
                ],
            ],
            [
                'slug' => 'confirmation', 'icon' => '🕊️', 'title' => 'Confirmation', 'subtitle' => 'L\'Esprit Saint au cœur de la foi',
                'description' => 'La Confirmation complète le Baptême et donne les dons de l\'Esprit Saint pour témoigner de la foi chrétienne.',
                'img' => 'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    'Préparation de 2 ans minimum',
                    'Réservée aux adolescents et adultes baptisés',
                    'Parcours de catéchèse approfondie',
                    'Parrain ou marraine catholique pratiquant',
                ],
            ],
            [
                'slug' => 'eucharistie', 'icon' => '✝️', 'title' => 'Eucharistie', 'subtitle' => 'Le Corps et le Sang du Christ',
                'description' => 'L\'Eucharistie est « la source et le sommet de toute la vie chrétienne ». Première Communion et messes dominicales.',
                'img' => 'https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    'Première Communion : après 2 ans de catéchèse',
                    'Messes quotidiennes à 06h30',
                    'Messes dominicales : 7h, 9h, 11h, 18h30',
                    'Communion aux malades sur demande',
                ],
            ],
            [
                'slug' => 'confession', 'icon' => '🙏', 'title' => 'Confession', 'subtitle' => 'La réconciliation avec Dieu',
                'description' => 'Le sacrement de Réconciliation nous offre le pardon de Dieu et la paix intérieure après le péché.',
                'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    'Confessions chaque jeudi de 17h00 à 18h15',
                    'Confessions avant chaque messe sur demande',
                    'Préparation à la première confession incluse dans la catéchèse',
                ],
            ],
            [
                'slug' => 'onction', 'icon' => '🕯️', 'title' => 'Onction des malades', 'subtitle' => 'La grâce dans l\'épreuve',
                'description' => "L'Onction des malades apporte la grâce divine aux personnes gravement malades ou âgées, en union avec la souffrance du Christ.",
                'img' => 'https://images.unsplash.com/photo-1763517789508-f23012039417?w=600&h=400&fit=crop&auto=format',
                'details' => [
                    'Messe des malades : 3ᵉ lundi du mois à 18h30',
                    'Visite aux malades sur demande au secrétariat',
                    'Onction possible à domicile ou à l\'hôpital',
                    'Contact d\'urgence : (+ 237) 655 529 999',
                ],
            ],
        ];

        foreach ($items as $i => $item) {
            $details = $item['details'];
            unset($item['details']);
            $item['sort_order'] = $i;

            $sacrement = Sacrement::updateOrCreate(['slug' => $item['slug']], $item);
            $sacrement->details()->delete();
            foreach (array_values($details) as $j => $detail) {
                $sacrement->details()->create(['detail' => $detail, 'sort_order' => $j]);
            }
        }
    }
}
