<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('homelies', function (Blueprint $table) {
            $table->string('reading_1')->nullable()->after('readings');
            $table->string('psalm')->nullable()->after('reading_1');
            $table->string('reading_2')->nullable()->after('psalm');
            $table->string('gospel')->nullable()->after('reading_2');
        });
    }

    public function down(): void
    {
        Schema::table('homelies', function (Blueprint $table) {
            $table->dropColumn(['reading_1', 'psalm', 'reading_2', 'gospel']);
        });
    }
};
