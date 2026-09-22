<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = 'admin@savio.com';
        $password = '12345678';

        User::updateOrCreate(
            ['email' => $email],
            [
                'nom' => 'Admin',
                'prenom' => 'Savio',
                'role' => 'admin',
                'password' => Hash::make($password),
            ]
        );

        $this->command->warn("Compte admin seedé : {$email} / {$password} — à changer dès la première connexion.");
    }
}
