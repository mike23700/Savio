<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('color', 20)->default('#0B3D91');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_category_id')->nullable()->constrained('event_categories')->nullOnDelete();
            $table->string('title');
            $table->date('date');
            $table->time('time')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['date', 'time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('event_categories');
    }
};
