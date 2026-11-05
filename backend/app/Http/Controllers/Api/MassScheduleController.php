<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MassSchedule;
use App\Services\NextMassCalculator;
use Carbon\Carbon;
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
                    // Used by the public week view (Monday → Sunday columns).
                    'sort_time' => $r->time ? substr($r->time, 0, 5) : null,
                    'weekdays' => $r->weekdays,
                    'recurrence_type' => $r->recurrence_type,
                    'nth_week_of_month' => $r->nth_week_of_month,
                    'counts_as_mass' => (bool) $r->counts_as_mass,
                ])->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    public function next(Request $request, NextMassCalculator $calculator)
    {
        return response()->json($calculator->next($this->clientNow($request)));
    }

    public function today(Request $request, NextMassCalculator $calculator)
    {
        $limit = (int) $request->query('limit', 0);

        return response()->json($calculator->today(
            $this->clientNow($request),
            $request->boolean('upcoming'),
            $request->boolean('masses'),
            $limit > 0 ? $limit : null,
        ));
    }

    /** Masses celebrated on `?date=YYYY-MM-DD` (used by the mass intention form). */
    public function day(Request $request, NextMassCalculator $calculator)
    {
        $date = $request->query('date');
        abort_unless(is_string($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date), 422, 'Date invalide.');

        return response()->json($calculator->massesOn(Carbon::parse($date)));
    }

    /**
     * Build "now" from the visitor's device so "next mass" and "today"
     * match the date and time shown on their computer:
     *  - `now` (e.g. "2026-09-23T14:05:00") is the device's local wall-clock time,
     *  - `tz` (e.g. "Africa/Douala") is the device's IANA timezone.
     * Falls back to the server clock (in `tz` when valid) when `now` is
     * missing or malformed.
     */
    private function clientNow(Request $request): Carbon
    {
        $tz = null;
        $tzParam = $request->query('tz');
        if (is_string($tzParam) && $tzParam !== '') {
            try {
                $tz = new \DateTimeZone($tzParam);
            } catch (\Exception) {
                // invalid timezone identifier → server timezone
            }
        }

        $nowParam = $request->query('now');
        if (is_string($nowParam) && preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/', $nowParam)) {
            try {
                return Carbon::parse($nowParam, $tz);
            } catch (\Exception) {
                // unparsable → fall through
            }
        }

        return $tz ? Carbon::now($tz) : Carbon::now();
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
        // Accept "06:30:00" (as stored by MySQL and sent back by older forms) as well as "06:30".
        $time = $request->input('time');
        if (is_string($time) && preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
            $request->merge(['time' => substr($time, 0, 5)]);
        }

        $data = $request->validate([
            'group_label' => 'nullable|string|max:255',
            'weekdays' => 'nullable|array',
            'weekdays.*' => 'integer|min:0|max:6',
            'recurrence_type' => 'required|in:weekly,monthly_nth_weekday,special',
            'nth_week_of_month' => 'nullable|integer|min:1|max:5',
            'time' => 'nullable|date_format:H:i',
            'time_label' => 'nullable|string|max:50',
            'type' => 'required|string|max:255',
            'note' => 'nullable|string|max:255',
            'counts_as_mass' => 'boolean',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ], [
            'type.required' => 'Choisissez le type (messe, adoration…).',
        ]);

        $weekdays = $data['weekdays'] ?? null;
        if ($data['recurrence_type'] !== 'special' && empty($weekdays)) {
            throw \Illuminate\Validation\ValidationException::withMessages(['weekdays' => 'Cochez au moins un jour.']);
        }
        if ($data['recurrence_type'] === 'monthly_nth_weekday' && empty($data['nth_week_of_month'])) {
            throw \Illuminate\Validation\ValidationException::withMessages(['nth_week_of_month' => 'Choisissez la semaine du mois.']);
        }
        if ($data['recurrence_type'] === 'special') {
            $data['weekdays'] = null;
            $data['nth_week_of_month'] = null;
        }

        // Group label and display order are computed: the admin only ticks days and times.
        if (empty($data['group_label'])) {
            $data['group_label'] = MassSchedule::labelFor($data['weekdays'] ?? null, $data['recurrence_type'], $data['nth_week_of_month'] ?? null, $data['type']);
        }
        if (! isset($data['sort_order'])) {
            $data['sort_order'] = MassSchedule::sortKeyFor($data['weekdays'] ?? null, $data['recurrence_type'], $data['time'] ?? null);
        }

        return $data;
    }
}
