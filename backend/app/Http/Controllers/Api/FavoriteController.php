<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FavoriteHomelie;
use App\Models\Homelie;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $homelieIds = FavoriteHomelie::where('user_id', $request->user()->id)->pluck('homelie_id');

        return response()->json(Homelie::whereIn('id', $homelieIds)->orderByDesc('published_at')->get());
    }

    public function store(Request $request, Homelie $homelie)
    {
        FavoriteHomelie::firstOrCreate(['user_id' => $request->user()->id, 'homelie_id' => $homelie->id]);

        return response()->json(['favorited' => true]);
    }

    public function destroy(Request $request, Homelie $homelie)
    {
        FavoriteHomelie::where('user_id', $request->user()->id)->where('homelie_id', $homelie->id)->delete();

        return response()->json(['favorited' => false]);
    }
}
