<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catechese_niveaux', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('age_label')->nullable();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->string('duree')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catechese_niveaux');
    }
};
