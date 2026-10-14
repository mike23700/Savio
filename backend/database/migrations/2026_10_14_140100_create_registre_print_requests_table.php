<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registre_print_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('registre_inscription_id')
                ->constrained('registre_inscriptions')
                ->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('statut', ['en_attente', 'en_traitement', 'prete', 'livree', 'refusee'])
                ->default('en_attente');
            $table->text('message')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('processed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registre_print_requests');
    }
};
