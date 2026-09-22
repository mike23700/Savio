<?php

namespace App\Services;

use App\Models\MassSchedule;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class NextMassCalculator
{
    /**
     * Expand active schedule rows into concrete upcoming occurrences within
     * the given horizon, sorted chronologically.
     *
     * @return Collection<int, array{schedule: MassSchedule, at: Carbon}>
     */
    public function upcomingOccurrences(?Carbon $now = null, int $horizonDays = 35, bool $onlyMasses = false): Collection
    {
        $now = $now ?? Carbon::now();
        $rows = MassSchedule::query()->where('is_active', true)
            ->when($onlyMasses, fn ($q) => $q->where('counts_as_mass', true))
            ->get();

        $occurrences = collect();

        foreach ($rows as $row) {
            $time = $row->time ? Carbon::parse($row->time) : null;

            if ($row->recurrence_type === 'weekly' && is_array($row->weekdays)) {
                foreach ($row->weekdays as $weekday) {
                    $date = $now->copy()->startOfDay();
                    while ($date->dayOfWeek !== (int) $weekday) {
                        $date->addDay();
                    }
                    $at = $this->combine($date, $time);
                    if ($at->lt($now)) {
                        $at->addWeek();
                    }
                    if ($at->lte($now->copy()->addDays($horizonDays))) {
                        $occurrences->push(['schedule' => $row, 'at' => $at]);
                    }
                }
            } elseif ($row->recurrence_type === 'monthly_nth_weekday' && $row->nth_week_of_month) {
                foreach ([0, 1] as $monthOffset) {
                    $month = $now->copy()->startOfMonth()->addMonths($monthOffset);
                    $at = $this->nthWeekdayOfMonth($month, (int) ($row->weekdays[0] ?? 1), (int) $row->nth_week_of_month, $time);
                    if ($at && $at->gte($now) && $at->lte($now->copy()->addDays($horizonDays))) {
                        $occurrences->push(['schedule' => $row, 'at' => $at]);
                    }
                }
            }
            // 'special' rows (e.g. "Nuit d'Adoration") are excluded from date-based projection.
        }

        return $occurrences->sortBy(fn ($o) => $o['at']->timestamp)->values();
    }

    public function next(?Carbon $now = null): ?array
    {
        $occurrence = $this->upcomingOccurrences($now, 35, true)->first();
        if (! $occurrence) {
            return null;
        }

        return $this->format($occurrence);
    }

    public function today(?Carbon $now = null): array
    {
        $now = $now ?? Carbon::now();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();

        return $this->upcomingOccurrences($now->copy()->startOfDay(), 1, false)
            ->filter(fn ($o) => $o['at']->between($todayStart, $todayEnd))
            ->map(fn ($o) => $this->format($o))
            ->values()
            ->all();
    }

    private function combine(Carbon $date, ?Carbon $time): Carbon
    {
        $at = $date->copy();
        if ($time) {
            $at->setTime($time->hour, $time->minute, 0);
        }

        return $at;
    }

    private function nthWeekdayOfMonth(Carbon $monthStart, int $weekday, int $nth, ?Carbon $time): ?Carbon
    {
        $date = $monthStart->copy()->startOfMonth();
        $count = 0;
        while ($date->month === $monthStart->month) {
            if ($date->dayOfWeek === $weekday) {
                $count++;
                if ($count === $nth) {
                    return $this->combine($date, $time);
                }
            }
            $date->addDay();
        }

        return null;
    }

    private function format(array $occurrence): array
    {
        /** @var MassSchedule $schedule */
        $schedule = $occurrence['schedule'];
        $at = $occurrence['at'];

        return [
            'at' => $at->toIso8601String(),
            'date' => $at->toDateString(),
            'time' => $schedule->time_label ?: $at->format('H\hi'),
            'day_label' => $at->translatedFormat('l'),
            'type' => $schedule->type,
            'note' => $schedule->note,
            'group_label' => $schedule->group_label,
        ];
    }
}
