<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaction_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['entree', 'sortie']);
            $table->string('color', 20)->default('#0B3D91');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_category_id')->nullable()->constrained('transaction_categories')->nullOnDelete();
            $table->enum('type', ['entree', 'sortie']);
            $table->string('libelle');
            $table->decimal('montant', 14, 0);
            $table->date('date');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['date']);
            $table->index(['type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('transaction_categories');
    }
};
