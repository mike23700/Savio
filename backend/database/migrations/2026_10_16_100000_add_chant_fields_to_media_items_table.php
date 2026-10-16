<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media_items', function (Blueprint $table) {
            $table->string('language', 50)->nullable()->after('title');
            $table->string('audio_url', 500)->nullable()->after('youtube_id');
            $table->string('pdf_url', 500)->nullable()->after('audio_url');
        });

        // Extend the type enum with the new "chant" value (cantiques & chants).
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `media_items` MODIFY `type` ENUM('photo','video','chant') NOT NULL");
        }
    }

    public function down(): void
    {
        Schema::table('media_items', function (Blueprint $table) {
            $table->dropColumn(['language', 'audio_url', 'pdf_url']);
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE `media_items` MODIFY `type` ENUM('photo','video') NOT NULL");
        }
    }
};
