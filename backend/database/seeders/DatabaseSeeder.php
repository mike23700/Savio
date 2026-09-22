<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            ParishSettingsSeeder::class,
            MassScheduleSeeder::class,
            SacrementSeeder::class,
            CatecheseNiveauSeeder::class,
            PrayerTimeSeeder::class,
            HomelieSeeder::class,
            MouvementSeeder::class,
            ProjetSeeder::class,
            ProductSeeder::class,
            JournalTarifSeeder::class,
            JournalIssueSeeder::class,
        ]);
    }
}
