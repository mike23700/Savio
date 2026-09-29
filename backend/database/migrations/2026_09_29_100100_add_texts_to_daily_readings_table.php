<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_readings', function (Blueprint $table) {
            $table->text('reading_1_text')->nullable()->after('reading_1');
            $table->text('psalm_text')->nullable()->after('psalm');
            $table->text('reading_2_text')->nullable()->after('reading_2');
            $table->text('gospel_text')->nullable()->after('gospel');
        });
    }

    public function down(): void
    {
        Schema::table('daily_readings', function (Blueprint $table) {
            $table->dropColumn(['reading_1_text', 'psalm_text', 'reading_2_text', 'gospel_text']);
        });
    }
};
