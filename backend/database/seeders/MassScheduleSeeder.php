<?php

namespace Database\Seeders;

use App\Models\MassSchedule;
use Illuminate\Database\Seeder;

/**
 * Mass times and other celebrations as printed on the parish sheet
 * (November 2026). Running this seeder REPLACES the whole schedule.
 * Weekdays: 0 = Sunday … 6 = Saturday.
 */
class MassScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $mass = fn (array $days, string $time, string $type, ?string $note = null) => [
            'weekdays' => $days, 'recurrence_type' => 'weekly', 'time' => $time,
            'type' => $type, 'note' => $note, 'counts_as_mass' => true,
        ];
        $other = fn (array $days, string $time, string $type, ?string $note = null, ?string $label = null) => [
            'weekdays' => $days, 'recurrence_type' => 'weekly', 'time' => $time, 'time_label' => $label,
            'type' => $type, 'note' => $note, 'counts_as_mass' => false,
        ];

        $rows = [
            // Semaine
            $mass([1, 2, 3, 4, 5], '06:30', 'Messe'),
            $mass([1, 2, 3, 4, 5], '12:30', 'Messe'),
            $mass([1, 2, 4, 5], '18:30', 'Messe'),
            // Samedi
            $mass([6], '06:30', 'Messe'),
            $mass([6], '18:30', 'Messe dominicale anticipée'),
            // Dimanche
            $mass([0], '06:30', 'Messe dominicale'),
            $mass([0], '08:00', 'Messe dominicale'),
            $mass([0], '09:30', 'Messe dominicale'),
            $mass([0], '11:15', 'Messe dominicale'),
            $mass([0], '18:00', 'Messe dominicale'),
            // Messe des malades
            [
                'weekdays' => [1], 'recurrence_type' => 'monthly_nth_weekday', 'nth_week_of_month' => 3,
                'time' => '18:30', 'type' => 'Messe pour les malades', 'note' => 'Avec bénédiction des sacramentaux',
                'counts_as_mass' => true,
            ],
            // Adoration, confessions, baptêmes
            $other([1, 2, 3, 5], '07:00', 'Adoration du Très Saint Sacrement', "Après la messe de 6h30, jusqu'à 18h30", 'Après 6h30'),
            $other([4], '07:15', 'Adoration du Très Saint Sacrement', "Jusqu'à 21h00, avec louange après la messe du soir animée par la chorale Vocem Angelorum et le groupe de prière Flamme d'amour et du Cœur immaculé de Marie"),
            [
                'weekdays' => null, 'recurrence_type' => 'special', 'time' => null, 'time_label' => 'Jour et nuit',
                'type' => 'Adoration perpétuelle', 'note' => 'Tous les lundis et 1ers vendredis du mois : toute la journée et toute la nuit',
                'counts_as_mass' => false,
            ],
            $other([4], '17:00', 'Confessions', "Jusqu'à 18h15"),
            $other([6], '09:30', 'Baptêmes des petits-enfants', 'Tous les samedis du mois et la veille des solennités'),
        ];

        MassSchedule::query()->delete();

        foreach ($rows as $row) {
            $row += ['nth_week_of_month' => null, 'time_label' => null, 'is_active' => true];
            $row['group_label'] = MassSchedule::labelFor($row['weekdays'], $row['recurrence_type'], $row['nth_week_of_month'], $row['type']);
            $row['sort_order'] = MassSchedule::sortKeyFor($row['weekdays'], $row['recurrence_type'], $row['time']);
            MassSchedule::create($row);
        }
    }
}
