<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MassSchedule;
use App\Services\NextMassCalculator;
use Illuminate\Http\Request;

class MassScheduleController extends Controller
{
    public function index()
    {
        $rows = MassSchedule::where('is_active', true)->orderBy('sort_order')->get();

        $grouped = $rows->groupBy('group_label')->map(function ($rowsInGroup, $label) {
            return [
                'day' => $label,
                'times' => $rowsInGroup->map(fn ($r) => [
                    'id' => $r->id,
                    'time' => $r->time_label ?: ($r->time ? substr($r->time, 0, 5) : null),
                    'type' => $r->type,
                    'note' => $r->note,
                ])->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    public function next(NextMassCalculator $calculator)
    {
        return response()->json($calculator->next());
    }

    public function today(NextMassCalculator $calculator)
    {
        return response()->json($calculator->today());
    }

    public function adminIndex()
    {
        return response()->json(MassSchedule::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        return response()->json(MassSchedule::create($data), 201);
    }

    public function update(Request $request, MassSchedule $massSchedule)
    {
        $data = $this->validated($request);
        $massSchedule->update($data);

        return response()->json($massSchedule);
    }

    public function destroy(MassSchedule $massSchedule)
    {
        $massSchedule->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'group_label' => 'required|string|max:255',
            'weekdays' => 'nullable|array',
            'weekdays.*' => 'integer|min:0|max:6',
            'recurrence_type' => 'required|in:weekly,monthly_nth_weekday,special',
            'nth_week_of_month' => 'nullable|integer|min:1|max:5',
            'time' => 'nullable|date_format:H:i',
            'time_label' => 'nullable|string|max:50',
            'type' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
            'counts_as_mass' => 'boolean',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }
}
