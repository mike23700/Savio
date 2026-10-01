<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Origin of an automatically recorded line (e.g. "donation"), so marking the
            // same donation paid again refreshes its line instead of duplicating it.
            $table->string('source_type', 50)->nullable()->after('notes');
            $table->unsignedBigInteger('source_id')->nullable()->after('source_type');
            $table->unique(['source_type', 'source_id']);
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropUnique(['source_type', 'source_id']);
            $table->dropColumn(['source_type', 'source_id']);
        });
    }
};
