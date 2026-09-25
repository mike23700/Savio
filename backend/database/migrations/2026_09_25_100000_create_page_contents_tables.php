<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // genese, histoire, savio, organisation, archidiocese, caritas
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('hero_image')->nullable();
            $table->text('intro')->nullable(); // paragraphs separated by blank lines, **bold** supported
            $table->json('extra')->nullable(); // per-page extras (quote, prayer, bio_image...)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('page_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('page_key');
            $table->string('kind'); // cures, timeline, milestone, card, pair, bullet, stat
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('meta')->nullable(); // years of a curé, date label, stat number...
            $table->string('icon')->nullable();
            $table->boolean('is_highlight')->default(false); // e.g. "curé actuel"
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['page_key', 'kind', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_blocks');
        Schema::dropIfExists('page_contents');
    }
};
