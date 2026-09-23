<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyReading;
use App\Services\AelfReadings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DailyReadingController extends Controller
{
    /**
     * Readings for a given day (`?date=YYYY-MM-DD`, the visitor's local
     * date). A reading entered by the parish in the admin wins; otherwise
     * the official readings are fetched from AELF.
     */
    public function show(Request $request, AelfReadings $aelf)
    {
        $date = $request->query('date');
        if (! is_string($date) || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            $date = Carbon::now()->toDateString();
        }

        $local = DailyReading::whereDate('date', $date)->first();
        if ($local) {
            return response()->json([...$local->toArray(), 'color' => null, 'source' => 'paroisse']);
        }

        return response()->json($aelf->forDate($date));
    }

    public function adminIndex()
    {
        return response()->json(DailyReading::orderByDesc('date')->get());
    }

    public function store(Request $request)
    {
        return response()->json(DailyReading::create($this->validated($request)), 201);
    }

    public function update(Request $request, DailyReading $dailyReading)
    {
        $dailyReading->update($this->validated($request, $dailyReading));

        return response()->json($dailyReading);
    }

    public function destroy(DailyReading $dailyReading)
    {
        $dailyReading->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request, ?DailyReading $current = null): array
    {
        return $request->validate([
            'date' => ['required', 'date_format:Y-m-d', Rule::unique('daily_readings', 'date')->ignore($current?->id)],
            'liturgical_day' => 'nullable|string|max:255',
            'reading_1' => 'nullable|string|max:120',
            'psalm' => 'nullable|string|max:120',
            'reading_2' => 'nullable|string|max:120',
            'gospel' => 'nullable|string|max:120',
            'gospel_title' => 'nullable|string|max:255',
        ]);
    }
}
