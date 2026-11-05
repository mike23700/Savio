<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Multi-day events (retreats, pilgrimages, jubilee weeks…): `end_date` is the
 * last day (inclusive), `end_time` the closing time on that day. A null
 * end_date means a one-day event, as before.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->date('end_date')->nullable()->after('time');
            $table->time('end_time')->nullable()->after('end_date');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['end_date', 'end_time']);
        });
    }
};
