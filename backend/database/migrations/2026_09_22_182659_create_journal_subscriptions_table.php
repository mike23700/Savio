<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tarif_id')->nullable()->constrained('journal_tarifs')->nullOnDelete();
            $table->enum('format', ['electronique', 'papier'])->default('electronique');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->date('started_at');
            $table->date('expires_at')->nullable();
            $table->foreignId('deactivated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('deactivated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_subscriptions');
    }
};
