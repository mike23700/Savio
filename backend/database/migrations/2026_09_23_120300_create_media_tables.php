<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['photo', 'video']);
            $table->foreignId('media_category_id')->nullable()->constrained('media_categories')->nullOnDelete();
            $table->string('title')->nullable();
            $table->string('image')->nullable();       // photo: stored path or URL
            $table->string('youtube_url')->nullable(); // video: link as pasted by the admin
            $table->string('youtube_id', 20)->nullable();
            $table->date('taken_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_items');
        Schema::dropIfExists('media_categories');
    }
};
