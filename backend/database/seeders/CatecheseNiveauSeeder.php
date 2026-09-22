<?php

namespace Database\Seeders;

use App\Models\CatecheseNiveau;
use Illuminate\Database\Seeder;

class CatecheseNiveauSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nom' => 'Éveil à la foi', 'age_label' => '5-6 ans', 'icon' => '🌱', 'description' => 'Introduction douce à la foi chrétienne pour les tout-petits. Découverte de Dieu à travers des histoires, des chants et des activités adaptées.', 'duree' => '1 an'],
            ['nom' => '1ère Année', 'age_label' => '7-8 ans', 'icon' => '📖', 'description' => 'Approfondissement de la foi, préparation à la première réconciliation et découverte des sacrements.', 'duree' => '1 an'],
            ['nom' => '2e Année', 'age_label' => '9-10 ans', 'icon' => '✝️', 'description' => "Préparation à la première communion. Découverte de l'Eucharistie et de sa place dans la vie chrétienne.", 'duree' => '1 an'],
            ['nom' => '3e Année', 'age_label' => '11-12 ans', 'icon' => '🕊️', 'description' => 'Approfondissement de la vie chrétienne, préparation à la confirmation et engagement dans la communauté.', 'duree' => '1 an'],
            ['nom' => 'Préparation au Mariage', 'age_label' => 'Adultes', 'icon' => '💍', 'description' => "Parcours complet pour les couples souhaitant se marier à l'Église. Sessions collectives et entretiens personnels.", 'duree' => '6 mois'],
        ];

        foreach ($items as $i => $item) {
            $item['sort_order'] = $i;
            CatecheseNiveau::updateOrCreate(['nom' => $item['nom']], $item);
        }
    }
}
