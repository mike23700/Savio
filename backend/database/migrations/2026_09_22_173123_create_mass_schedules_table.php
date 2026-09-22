<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mass_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('group_label');
            $table->json('weekdays')->nullable();
            $table->enum('recurrence_type', ['weekly', 'monthly_nth_weekday', 'special'])->default('weekly');
            $table->unsignedTinyInteger('nth_week_of_month')->nullable();
            $table->time('time')->nullable();
            $table->string('time_label')->nullable();
            $table->string('type');
            $table->string('note')->nullable();
            $table->boolean('counts_as_mass')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mass_schedules');
    }
};
