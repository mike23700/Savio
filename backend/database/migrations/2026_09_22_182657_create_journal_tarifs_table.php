<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_tarifs', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('price_label');
            $table->unsignedInteger('issues');
            $table->string('period');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_tarifs');
    }
};
