<?php

namespace Database\Seeders;

use App\Models\Homelie;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HomelieSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Hosanna ! – Dimanche des Rameaux', 'published_at' => '2026-09-10 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Is 50,4-7 · Ph 2,6-11 · Lc 22,14 – 23,56', 'sunday' => 'Dimanche des Rameaux', 'duration' => '18 min', 'excerpt' => "En ce dimanche des Rameaux, nous entrons dans la Semaine Sainte en suivant Jésus dans sa montée vers Jérusalem...", 'img' => 'https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=400&h=240&fit=crop&auto=format'],
            ['title' => 'La Croix Glorieuse – Source de salut', 'published_at' => '2026-09-14 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Nb 21,4b-9 · Ph 2,6-11 · Jn 3,13-17', 'sunday' => 'Fête de la Croix Glorieuse', 'duration' => '22 min', 'excerpt' => "Aujourd'hui, nous célébrons la fête de la Croix Glorieuse. La croix est le signe par excellence de l'amour de Dieu pour l'humanité...", 'img' => 'https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=400&h=240&fit=crop&auto=format'],
            ['title' => 'Là où est ton trésor – Matthieu 6', 'published_at' => '2026-09-07 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Am 6,1a.4-7 · 1Tm 6,11-16 · Lc 16,19-31', 'sunday' => '26ᵉ dimanche du Temps ordinaire', 'duration' => '20 min', 'excerpt' => "L'Évangile de ce dimanche nous invite à réfléchir sur nos priorités et sur ce qui compte vraiment dans nos vies...", 'img' => 'https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=400&h=240&fit=crop&auto=format'],
            ['title' => 'Perdre sa vie pour la trouver', 'published_at' => '2026-08-31 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Jr 20,7-9 · Rm 12,1-2 · Mt 16,21-27', 'sunday' => '22ᵉ dimanche du Temps ordinaire', 'duration' => '19 min', 'excerpt' => 'Jésus nous invite aujourd\'hui à prendre notre croix et à le suivre. Mais que signifie concrètement ce chemin de renoncement ?', 'img' => 'https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=400&h=240&fit=crop&auto=format'],
            ['title' => 'Tu es Pierre et sur cette pierre', 'published_at' => '2026-08-24 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Is 22,19-23 · Rm 11,33-36 · Mt 16,13-20', 'sunday' => '21ᵉ dimanche du Temps ordinaire', 'duration' => '17 min', 'excerpt' => 'La question que Jésus pose à ses disciples est fondamentale : « Et vous, qui dites-vous que je suis ? »', 'img' => 'https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=400&h=240&fit=crop&auto=format'],
            ['title' => 'Le pain vivant descendu du ciel', 'published_at' => '2026-08-17 09:00:00', 'priest' => 'Père Curé', 'readings' => 'Pr 9,1-6 · Ep 5,15-20 · Jn 6,51-58', 'sunday' => '20ᵉ dimanche du Temps ordinaire', 'duration' => '21 min', 'excerpt' => "L'Eucharistie est au cœur de notre foi. Jésus se donne lui-même comme nourriture pour notre vie spirituelle...", 'img' => 'https://images.unsplash.com/photo-1763517789508-f23012039417?w=400&h=240&fit=crop&auto=format'],
        ];

        foreach ($items as $item) {
            $item['slug'] = Str::slug($item['title']);
            Homelie::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
