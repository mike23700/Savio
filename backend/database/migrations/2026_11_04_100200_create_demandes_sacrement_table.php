<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Requests sent from the form under the sacraments list (/celebrer/sacrements):
 * the applicant's details plus the people concerned
 * (`personnes` = [{"nom","prenom","age"}, …]).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demandes_sacrement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sacrement_id')->nullable()->constrained('sacrements')->nullOnDelete();
            $table->string('sacrement_nom')->nullable(); // snapshot, survives a deleted sacrament
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->nullable();
            $table->string('telephone', 30);
            $table->json('personnes');
            $table->text('message')->nullable();
            $table->enum('statut', ['nouvelle', 'en_cours', 'traitee', 'annulee'])->default('nouvelle');
            $table->timestamps();
        });

        Schema::table('bans', function (Blueprint $table) {
            $table->unsignedTinyInteger('fiance1_age')->nullable()->after('fiance1_prenom');
            $table->unsignedTinyInteger('fiance2_age')->nullable()->after('fiance2_prenom');
        });
    }

    public function down(): void
    {
        Schema::table('bans', function (Blueprint $table) {
            $table->dropColumn(['fiance1_age', 'fiance2_age']);
        });
        Schema::dropIfExists('demandes_sacrement');
    }
};
