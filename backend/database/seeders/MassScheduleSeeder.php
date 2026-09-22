<?php

namespace Database\Seeders;

use App\Models\MassSchedule;
use Illuminate\Database\Seeder;

class MassScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['group_label' => 'Lundi – Vendredi', 'weekdays' => [1, 2, 3, 4, 5], 'recurrence_type' => 'weekly', 'time' => '06:30', 'type' => 'Messe quotidienne', 'note' => "Suivie d'adoration jusqu'à 18h30", 'counts_as_mass' => true, 'sort_order' => 1],
            ['group_label' => 'Jeudi', 'weekdays' => [4], 'recurrence_type' => 'weekly', 'time' => '07:15', 'type' => 'Adoration', 'note' => 'Jusqu\'à 21h', 'counts_as_mass' => false, 'sort_order' => 2],
            ['group_label' => 'Jeudi', 'weekdays' => [4], 'recurrence_type' => 'weekly', 'time' => '17:00', 'type' => 'Confessions', 'note' => 'Jusqu\'à 18h15', 'counts_as_mass' => false, 'sort_order' => 3],
            ['group_label' => 'Samedi', 'weekdays' => [6], 'recurrence_type' => 'weekly', 'time' => '06:30', 'type' => 'Messe', 'note' => null, 'counts_as_mass' => true, 'sort_order' => 4],
            ['group_label' => 'Samedi', 'weekdays' => [6], 'recurrence_type' => 'weekly', 'time' => '09:00', 'type' => "Baptêmes d'enfants", 'note' => 'Dernier samedi du mois & veille des solennités', 'counts_as_mass' => false, 'sort_order' => 5],
            ['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '07:00', 'type' => 'Messe', 'note' => null, 'counts_as_mass' => true, 'sort_order' => 6],
            ['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '09:00', 'type' => 'Messe', 'note' => null, 'counts_as_mass' => true, 'sort_order' => 7],
            ['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '11:00', 'type' => 'Messe principale', 'note' => null, 'counts_as_mass' => true, 'sort_order' => 8],
            ['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '18:30', 'type' => 'Messe du soir', 'note' => null, 'counts_as_mass' => true, 'sort_order' => 9],
            ['group_label' => '3ᵉ Lundi du mois', 'weekdays' => [1], 'recurrence_type' => 'monthly_nth_weekday', 'nth_week_of_month' => 3, 'time' => '18:30', 'type' => 'Messe des malades', 'note' => 'Avec bénédiction sacramentelle', 'counts_as_mass' => true, 'sort_order' => 10],
            ['group_label' => "Nuit d'Adoration", 'weekdays' => null, 'recurrence_type' => 'special', 'time' => null, 'time_label' => 'Nuit', 'type' => 'Adoration nocturne', 'note' => 'Chaque lundi & 1er vendredi du mois', 'counts_as_mass' => false, 'sort_order' => 11],
        ];

        foreach ($rows as $row) {
            MassSchedule::updateOrCreate(
                ['group_label' => $row['group_label'], 'type' => $row['type'], 'time' => $row['time'] ?? null],
                $row
            );
        }
    }
}
