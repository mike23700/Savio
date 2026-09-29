<?php

namespace App\Services;

use App\Models\Espace;
use App\Models\Reservation;
use Carbon\Carbon;

/**
 * Day-by-day occupancy of a bookable space, counting the units held by
 * reservations that still hold their dates (see Reservation::holdingDates).
 */
class EspaceAvailability
{
    /**
     * Units already booked per day within [$from, $to] (inclusive).
     *
     * @return array<string, int>
     */
    public function occupancy(Espace $espace, Carbon $from, Carbon $to, ?int $ignoreReservationId = null): array
    {
        $rows = Reservation::query()
            ->holdingDates()
            ->where('espace_id', $espace->id)
            ->when($ignoreReservationId, fn ($q) => $q->whereKeyNot($ignoreReservationId))
            ->whereDate('date_debut', '<=', $to->toDateString())
            ->whereDate('date_fin', '>=', $from->toDateString())
            ->get(['date_debut', 'date_fin', 'nb_unites']);

        $used = [];
        foreach ($rows as $r) {
            foreach (Reservation::occupiedDays($espace->kind, $r->date_debut, $r->date_fin) as $day) {
                if ($day >= $from->toDateString() && $day <= $to->toDateString()) {
                    $used[$day] = ($used[$day] ?? 0) + $r->nb_unites;
                }
            }
        }

        return $used;
    }

    /** Units still free on every day of the requested stay/event (0 = unavailable). */
    public function unitsLeft(Espace $espace, Carbon $debut, Carbon $fin, ?int $ignoreReservationId = null): int
    {
        $days = Reservation::occupiedDays($espace->kind, $debut, $fin);
        if ($days === []) {
            return 0;
        }

        $used = $this->occupancy($espace, Carbon::parse($days[0]), Carbon::parse(end($days)), $ignoreReservationId);
        $maxUsed = collect($days)->map(fn ($d) => $used[$d] ?? 0)->max();

        return max(0, $espace->quantite - $maxUsed);
    }

    /**
     * Days on which every unit is taken, over the next $horizonDays days
     * (shown as unavailable in the booking calendar).
     *
     * @return list<string>
     */
    public function fullDays(Espace $espace, int $horizonDays = 180): array
    {
        $from = Carbon::today();
        $used = $this->occupancy($espace, $from, $from->copy()->addDays($horizonDays));

        return collect($used)
            ->filter(fn ($n) => $n >= $espace->quantite)
            ->keys()
            ->sort()
            ->values()
            ->all();
    }

    /** Number of billed units of time: nights for a room, days for a hall. */
    public static function duration(Espace $espace, Carbon $debut, Carbon $fin): int
    {
        $diff = (int) $debut->copy()->startOfDay()->diffInDays($fin->copy()->startOfDay(), false);

        return $espace->isChambre() ? $diff : $diff + 1;
    }
}
