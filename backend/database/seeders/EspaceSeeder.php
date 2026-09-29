<?php

namespace Database\Seeders;

use App\Models\Espace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Example rooms and halls so the booking pages are not empty on a fresh
 * install. Names, prices and photos are placeholders to adjust in
 * /admin/hebergement/espaces.
 */
class EspaceSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'kind' => 'chambre', 'nom' => 'Chambre individuelle', 'capacite' => 1, 'quantite' => 4, 'prix' => 10000,
                'resume' => 'Chambre calme pour une personne, idéale pour une retraite ou un séjour de passage.',
                'description' => "Chambre individuelle du centre d'accueil paroissial, au calme, à deux pas de l'église.\nLe petit-déjeuner peut être servi sur demande auprès du secrétariat.",
                'equipements' => ['Lit simple', 'Ventilateur', 'Salle d\'eau privée', 'Wi-Fi', 'Bureau'],
                'photos' => ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop&auto=format'],
            ],
            [
                'kind' => 'chambre', 'nom' => 'Chambre double', 'capacite' => 2, 'quantite' => 3, 'prix' => 15000,
                'resume' => 'Chambre pour deux personnes (grand lit ou deux lits), climatisée.',
                'description' => "Chambre double climatisée du centre d'accueil, adaptée aux couples, familles de passage ou membres de délégations.",
                'equipements' => ['Grand lit ou 2 lits', 'Climatisation', 'Salle d\'eau privée', 'Wi-Fi', 'Moustiquaire'],
                'photos' => ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format'],
            ],
            [
                'kind' => 'salle', 'nom' => 'Grande salle polyvalente', 'capacite' => 300, 'quantite' => 1, 'prix' => 100000,
                'resume' => 'Pour mariages, réceptions, conférences et grandes rencontres.',
                'description' => "Grande salle de la paroisse pouvant accueillir jusqu'à 300 personnes : réceptions de mariage, baptêmes, communions, conférences, concerts.\nLe ménage et la sonorisation peuvent être prévus en option avec le secrétariat.",
                'equipements' => ['300 chaises', 'Tables', 'Sonorisation', 'Scène', 'Parking', 'Toilettes'],
                'photos' => ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=800&fit=crop&auto=format'],
            ],
            [
                'kind' => 'salle', 'nom' => 'Salle de réunion', 'capacite' => 40, 'quantite' => 1, 'prix' => 25000,
                'resume' => 'Pour réunions, formations, séminaires et petites rencontres.',
                'description' => 'Salle équipée pour les réunions, formations et séminaires jusqu\'à 40 personnes.',
                'equipements' => ['40 places assises', 'Vidéoprojecteur', 'Tableau blanc', 'Climatisation', 'Wi-Fi'],
                'photos' => ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop&auto=format'],
            ],
            [
                'kind' => 'salle', 'nom' => 'Esplanade de la paroisse', 'capacite' => 800, 'quantite' => 1, 'prix' => null,
                'resume' => 'Espace extérieur pour les grands événements — tarif sur devis.',
                'description' => "Esplanade extérieure pour les grands rassemblements. Le tarif dépend de l'événement : envoyez votre demande, le secrétariat vous recontacte avec un devis.",
                'equipements' => ['Espace plein air', 'Accès électricité', 'Parking'],
                'photos' => ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&h=800&fit=crop&auto=format'],
            ],
        ];

        foreach ($items as $i => $item) {
            $item['slug'] = Str::slug($item['nom']);
            $item['sort_order'] = $i;
            Espace::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
