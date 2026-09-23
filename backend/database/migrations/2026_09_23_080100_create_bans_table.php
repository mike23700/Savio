<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // Contact principal
            $table->string('nom');
            $table->string('prenom');
            $table->string('email');
            $table->string('telephone');
            // Fiancés
            $table->string('fiance1_nom');
            $table->string('fiance1_prenom');
            $table->string('fiance2_nom');
            $table->string('fiance2_prenom');
            $table->date('mariage_date')->nullable();
            $table->enum('statut', ['nouveau', 'en_cours', 'publie', 'archive'])->default('nouveau');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bans');
    }
};
