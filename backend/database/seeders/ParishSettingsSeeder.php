<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class ParishSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'parish.name' => 'Paroisse Saint Dominique Savio',
            'parish.short_name' => 'Saint Dominique Savio',
            'parish.location' => 'Douala · Cameroun',
            'parish.address' => 'Rue de la Messe Bonadoumbé, Douala',
            'parish.phone' => '(+237) 655 529 999',
            'parish.whatsapp_number' => '237655529999',
            'parish.email' => 'secretariat@paroissesaintdominiquesavio.com',
            'parish.hours' => 'Lun–Ven : 8h–13h & 15h30–18h30',
            'parish.founded' => '4 décembre 1961',
            'parish.diocese' => 'Archidiocèse de Douala',
            'parish.deanery' => 'Doyenné Wouri I',
            'parish.tagline' => 'Une communauté de foi, de prière, de fraternité et de service',
            'parish.maps_url' => 'https://goo.gl/maps/bPGHqwpVQrioTF7n6',
            'social.facebook_url' => '',
            'social.youtube_url' => '',
            'social.instagram_url' => '',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
