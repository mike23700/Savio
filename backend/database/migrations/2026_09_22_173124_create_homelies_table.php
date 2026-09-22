<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homelies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('priest')->nullable();
            $table->string('readings')->nullable();
            $table->string('sunday')->nullable();
            $table->string('duration')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('img')->nullable();
            $table->dateTime('published_at');
            $table->string('audio_url')->nullable();
            $table->string('pdf_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homelies');
    }
};
