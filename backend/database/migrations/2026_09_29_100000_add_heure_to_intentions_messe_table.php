<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intentions_messe', function (Blueprint $table) {
            $table->string('heure_souhaitee', 50)->nullable()->after('date_souhaitee');
            $table->string('messe_type')->nullable()->after('heure_souhaitee');
        });
    }

    public function down(): void
    {
        Schema::table('intentions_messe', function (Blueprint $table) {
            $table->dropColumn(['heure_souhaitee', 'messe_type']);
        });
    }
};
