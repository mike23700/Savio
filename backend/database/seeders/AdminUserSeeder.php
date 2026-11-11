<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = (string) config('app.admin_seed.email', 'admin@savio.com');
        $password = (string) config('app.admin_seed.password', '12345678');

        $user = User::query()->where('email', $email)->first();

        // Never overwrite the password of an existing account: running the
        // seeder again on a live site must not reset the admin credentials.
        if ($user !== null) {
            if ($user->role !== 'admin') {
                $user->forceFill(['role' => 'admin'])->save();
            }

            $this->command->warn(
                "Compte admin existant conservé : {$email} (mot de passe inchangé)."
            );

            return;
        }

        User::create([
            'nom' => 'Admin',
            'prenom' => 'Savio',
            'role' => 'admin',
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $this->command->warn("Compte admin créé : {$email} / {$password} — à changer dès la première connexion.");

        if ($password === '12345678' || $password === 'change-me-before-seeding' || strlen($password) < 8) {
            $this->command->warn(
                '⚠ Mot de passe faible ou exemple utilisé. Change-le depuis l’admin après '
                . 'la première connexion (le seeder ne réécrit jamais un compte existant).'
            );
        }
    }
}
