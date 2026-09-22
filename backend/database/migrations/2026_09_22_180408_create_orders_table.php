<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->nullable();
            $table->string('telephone');
            $table->decimal('total', 12, 0);
            $table->enum('payment_method', ['orange_money', 'mtn_momo', 'especes']);
            $table->enum('payment_status', ['en_attente', 'paye', 'annule'])->default('en_attente');
            $table->enum('order_status', ['en_attente', 'confirmee', 'preparee', 'livree', 'annulee'])->default('en_attente');
            $table->string('payment_reference')->nullable();
            $table->foreignId('confirmed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
