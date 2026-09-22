<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nom' => 'La prière - Un guide complet', 'prix' => 7000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => 'Un guide complet sur la vie de prière chrétienne.'],
            ['nom' => 'Un temps pour changer', 'prix' => 7000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => 'Ouvrage de conversion et de renouveau spirituel.'],
            ['nom' => 'Le COVID est notre moment de Noé', 'prix' => 3000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => 'Réflexion spirituelle sur la pandémie et la foi.'],
            ['nom' => 'Vices et vertus', 'prix' => 4000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => 'Enseignement moral chrétien sur les vertus et les vices.'],
            ['nom' => 'Les fondamentaux de la foi chrétienne', 'prix' => 4500, 'prix_barre' => 5000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => 'Introduction complète aux fondements de la foi catholique.'],
            ['nom' => "La Bonne Nouvelle de l'Église sur le mariage", 'prix' => 2000, 'category' => 'Livres', 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=300&h=300&fit=crop', 'description' => "L'enseignement de l'Église catholique sur le sacrement du mariage."],
            ['nom' => 'Chapelet', 'prix' => 500, 'category' => 'Accessoires', 'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop', 'description' => 'Chapelet classique pour la prière mariale.'],
            ['nom' => 'Collier', 'prix' => 1000, 'category' => 'Accessoires', 'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop', 'description' => 'Collier religieux béni.'],
            ['nom' => 'Chaîne blanche', 'prix' => 1500, 'category' => 'Accessoires', 'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=300&h=300&fit=crop', 'description' => 'Chaîne blanche pour la foi.'],
        ];

        foreach ($items as $i => $item) {
            $item['slug'] = Str::slug($item['nom']);
            $item['sort_order'] = $i;
            Product::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
