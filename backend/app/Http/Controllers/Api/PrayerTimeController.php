<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrayerTime;
use Illuminate\Http\Request;

class PrayerTimeController extends Controller
{
    public function index()
    {
        return response()->json(PrayerTime::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function adminIndex()
    {
        return response()->json(PrayerTime::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        return response()->json(PrayerTime::create($this->validated($request)), 201);
    }

    public function update(Request $request, PrayerTime $prayerTime)
    {
        $prayerTime->update($this->validated($request));

        return response()->json($prayerTime);
    }

    public function destroy(PrayerTime $prayerTime)
    {
        $prayerTime->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'icon' => 'nullable|string|max:20',
            'title' => 'required|string|max:255',
            'time_label' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }
}
