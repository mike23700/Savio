<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Team of a council / movement / choir: ordered list of
 * {"photo": "team/x.jpg"|null, "nom": "...", "titre": "Président"|null}.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mouvements', function (Blueprint $table) {
            $table->json('membres')->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('mouvements', function (Blueprint $table) {
            $table->dropColumn('membres');
        });
    }
};
