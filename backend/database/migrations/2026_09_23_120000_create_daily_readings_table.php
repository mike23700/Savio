<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_readings', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->string('liturgical_day')->nullable();
            $table->string('reading_1')->nullable();
            $table->string('psalm')->nullable();
            $table->string('reading_2')->nullable();
            $table->string('gospel')->nullable();
            $table->string('gospel_title')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_readings');
    }
};
