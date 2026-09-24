<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['orders', 'donations'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->enum('payment_status', ['en_attente', 'paye', 'echoue', 'annule'])->default('en_attente')->change();
                $table->string('payment_provider', 20)->nullable()->after('payment_reference');
                $table->string('payment_provider_status', 20)->nullable()->after('payment_provider');
                $table->text('payment_details')->nullable()->after('payment_provider_status');
                $table->index('payment_reference');
            });
        }

        Schema::table('donations', function (Blueprint $table) {
            $table->string('telephone', 30)->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn('telephone');
        });

        foreach (['orders', 'donations'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropIndex(['payment_reference']);
                $table->dropColumn(['payment_provider', 'payment_provider_status', 'payment_details']);
                $table->enum('payment_status', ['en_attente', 'paye', 'annule'])->default('en_attente')->change();
            });
        }
    }
};
