<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registre_inscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->nullable();
            $table->string('telephone');
            $table->string('tranche_age')->nullable();
            $table->string('rue')->nullable();
            $table->string('quartier')->nullable();
            $table->string('lieu_dit')->nullable();
            $table->boolean('membre_cev')->default(false);
            $table->string('quelle_cev')->nullable();
            $table->boolean('membre_groupe')->default(false);
            $table->string('quel_groupe')->nullable();
            $table->string('anciennete')->nullable();
            $table->enum('source', ['public', 'admin'])->default('public');
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registre_inscriptions');
    }
};
