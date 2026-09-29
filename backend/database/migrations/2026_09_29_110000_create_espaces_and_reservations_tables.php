<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bookable spaces: guest rooms of the welcome centre and rentable halls.
        Schema::create('espaces', function (Blueprint $table) {
            $table->id();
            $table->enum('kind', ['chambre', 'salle']);
            $table->string('nom');
            $table->string('slug')->unique();
            $table->string('resume')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('capacite')->nullable();
            // number of identical units (e.g. 4 twin rooms) that can be booked at once
            $table->unsignedSmallInteger('quantite')->default(1);
            // per night for a room, per day for a hall; null = price on request
            $table->decimal('prix', 12, 0)->nullable();
            $table->json('equipements')->nullable();
            $table->json('photos')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('espace_id')->constrained('espaces')->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->nullable();
            $table->string('telephone');
            // room: arrival / departure day (exclusive); hall: first / last day (inclusive)
            $table->date('date_debut');
            $table->date('date_fin');
            $table->unsignedSmallInteger('nb_unites')->default(1);
            $table->unsignedSmallInteger('nb_personnes')->nullable();
            $table->string('evenement')->nullable();
            $table->text('message')->nullable();
            $table->decimal('montant', 12, 0)->nullable();
            $table->enum('payment_method', ['orange_money', 'mtn_momo', 'especes'])->nullable();
            $table->enum('payment_status', ['en_attente', 'paye', 'echoue', 'annule'])->default('en_attente');
            $table->string('payment_reference')->nullable()->index();
            $table->string('payment_provider', 20)->nullable();
            $table->string('payment_provider_status', 20)->nullable();
            $table->text('payment_details')->nullable();
            $table->enum('statut', ['en_attente', 'confirmee', 'terminee', 'annulee'])->default('en_attente');
            $table->foreignId('confirmed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['espace_id', 'date_debut', 'date_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('espaces');
    }
};
