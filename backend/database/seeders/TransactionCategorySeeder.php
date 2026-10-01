<?php

namespace Database\Seeders;

use App\Models\TransactionCategory;
use Illuminate\Database\Seeder;

class TransactionCategorySeeder extends Seeder
{
    /** Starter categories for the parish accounting screens. */
    public function run(): void
    {
        $categories = [
            ['name' => 'Dons et offrandes', 'type' => 'entree', 'color' => '#16a34a'],
            ['name' => 'Quêtes', 'type' => 'entree', 'color' => '#0B3D91'],
            ['name' => 'Location de salles', 'type' => 'entree', 'color' => '#0e7490'],
            ['name' => 'Centre d\'accueil', 'type' => 'entree', 'color' => '#7c3aed'],
            ['name' => 'Boutique et journal', 'type' => 'entree', 'color' => '#0891b2'],
            ['name' => 'Aide Caritas', 'type' => 'sortie', 'color' => '#dc2626'],
            ['name' => 'Entretien et réparations', 'type' => 'sortie', 'color' => '#b45309'],
            ['name' => 'Énergie et eau', 'type' => 'sortie', 'color' => '#ca8a04'],
            ['name' => 'Achat de fournitures', 'type' => 'sortie', 'color' => '#4b5563'],
            ['name' => 'Projets paroissiaux', 'type' => 'sortie', 'color' => '#1d4ed8'],
        ];

        foreach ($categories as $i => $category) {
            TransactionCategory::updateOrCreate(
                ['name' => $category['name'], 'type' => $category['type']],
                ['color' => $category['color'], 'sort_order' => $i]
            );
        }
    }
}
