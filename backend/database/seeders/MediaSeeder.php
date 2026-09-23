<?php

namespace Database\Seeders;

use App\Models\MediaCategory;
use App\Models\MediaItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $ids = [];
        foreach (['Célébrations', 'Communauté', 'Église', 'Catéchèse', 'Formation'] as $i => $name) {
            $ids[$name] = MediaCategory::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'sort_order' => $i])->id;
        }

        // Starter photos (the gallery previously hard-coded in Mediatheque.tsx).
        $photos = [
            ['https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1200&h=800&fit=crop&auto=format', 'Communauté en prière', 'Célébrations'],
            ['https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1200&h=800&fit=crop&auto=format', 'Rassemblement communautaire', 'Communauté'],
            ['https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1200&h=800&fit=crop&auto=format', 'Cierges en prière', 'Célébrations'],
            ['https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1200&h=800&fit=crop&auto=format', "Autel de l'église", 'Église'],
            ['https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1200&h=800&fit=crop&auto=format', 'Prière en église', 'Célébrations'],
            ['https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1200&h=800&fit=crop&auto=format', 'Catéchèse', 'Catéchèse'],
            ['https://images.unsplash.com/photo-1763517789508-f23012039417?w=1200&h=800&fit=crop&auto=format', 'Formation spirituelle', 'Formation'],
            ['https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=1200&h=800&fit=crop&auto=format', 'Adoration', 'Célébrations'],
        ];

        foreach ($photos as $i => [$image, $title, $cat]) {
            MediaItem::updateOrCreate(
                ['type' => 'photo', 'image' => $image],
                ['title' => $title, 'media_category_id' => $ids[$cat], 'sort_order' => $i, 'is_published' => true],
            );
        }
    }
}
