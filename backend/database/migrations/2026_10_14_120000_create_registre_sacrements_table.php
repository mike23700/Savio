<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registre_sacrements', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['bapteme', 'communion', 'confirmation', 'mariage']);

            // Identité / Noms
            $table->string('nom');
            $table->enum('sexe', ['fils', 'fille'])->nullable(); // Baptême : Fils / Fille de

            // Baptême : filiation, dates, registre, parrain/marraine, village
            $table->string('pere')->nullable();            // Fils/Fille de
            $table->string('mere')->nullable();            // Et de
            $table->date('date_naissance')->nullable();    // Né(e) le
            $table->date('date_evenement')->nullable();    // Baptisé(e) le / Le / On
            $table->string('lieu')->nullable();            // Village / À / At
            $table->string('numero')->nullable();          // N° (N° L.M.)
            $table->string('numero_registre')->nullable(); // N° du Registre (N° L.B.)
            $table->string('parrain_marraine')->nullable();// Parrain/Marraine / Sponsors

            // Mariage
            $table->string('conjoint')->nullable();        // Avec / With
            $table->string('baptise_a')->nullable();       // Baptisé(e) à / Baptized at
            $table->string('temoins')->nullable();         // Témoins / Witnesses

            // Célébrant / signature
            $table->string('ministre')->nullable();        // Ministre / Minister
            $table->string('signataire')->nullable();      // Signature / Signed by
            $table->date('date_certificat')->nullable();   // Certifié exact le

            $table->text('remarques')->nullable();         // Remarques / Remarks

            $table->enum('source', ['public', 'admin'])->default('public');
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registre_sacrements');
    }
};
