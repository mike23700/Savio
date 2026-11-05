<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Shop categories managed from the admin (Livres, Bibles, Missels…) and up to
 * two extra pictures per product (`images`, the main one stays in `img`).
 * `products.category` keeps the category name, so existing rows keep working;
 * the categories already used are imported.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->json('images')->nullable()->after('img');
        });

        $names = DB::table('products')->distinct()->pluck('category')->filter()->values();
        foreach ($names as $i => $name) {
            DB::table('product_categories')->insertOrIgnore([
                'name' => $name,
                'slug' => Str::slug($name),
                'sort_order' => $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('images');
        });
        Schema::dropIfExists('product_categories');
    }
};
