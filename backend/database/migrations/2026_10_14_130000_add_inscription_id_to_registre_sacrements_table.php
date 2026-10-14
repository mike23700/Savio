<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registre_sacrements', function (Blueprint $table) {
            $table->foreignId('registre_inscription_id')
                ->nullable()
                ->after('type')
                ->constrained('registre_inscriptions')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('registre_sacrements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('registre_inscription_id');
        });
    }
};
