<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MassSchedule extends Model
{
    protected $fillable = [
        'group_label', 'weekdays', 'recurrence_type', 'nth_week_of_month',
        'time', 'time_label', 'type', 'note', 'counts_as_mass', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'weekdays' => 'array',
            'counts_as_mass' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    private const DAY_NAMES = [0 => 'Dimanche', 1 => 'Lundi', 2 => 'Mardi', 3 => 'Mercredi', 4 => 'Jeudi', 5 => 'Vendredi', 6 => 'Samedi'];

    /** Days in Monday-first order (1…6, 0). */
    private static function mondayFirst(array $days): array
    {
        $days = array_values(array_unique(array_map('intval', $days)));
        usort($days, fn ($a, $b) => (($a + 6) % 7) <=> (($b + 6) % 7));

        return $days;
    }

    /**
     * Human label for a schedule row, used to group rows on the public page
     * ("Lundi – Vendredi", "Samedi & Dimanche", "3ᵉ lundi du mois"…).
     */
    public static function labelFor(?array $weekdays, string $recurrence, ?int $nth, string $type): string
    {
        if ($recurrence === 'special' || ! $weekdays) {
            return $type;
        }

        if ($recurrence === 'monthly_nth_weekday') {
            $ordinal = $nth === 1 ? '1ᵉʳ' : ($nth === 5 ? 'Dernier' : $nth . 'ᵉ');

            return $ordinal . ' ' . mb_strtolower(self::DAY_NAMES[(int) $weekdays[0]] ?? '') . ' du mois';
        }

        $days = self::mondayFirst($weekdays);
        if (count($days) === 7) {
            return 'Tous les jours';
        }
        if ($days === [6, 0]) {
            return 'Samedi & Dimanche';
        }
        // A run of consecutive days (Monday-first) of 3 or more: "Lundi – Vendredi".
        $idx = array_map(fn ($d) => ($d + 6) % 7, $days);
        if (count($days) >= 3 && end($idx) - $idx[0] === count($idx) - 1) {
            return self::DAY_NAMES[$days[0]] . ' – ' . self::DAY_NAMES[end($days)];
        }
        $names = array_map(fn ($d) => self::DAY_NAMES[$d], $days);

        return count($names) > 1
            ? implode(', ', array_slice($names, 0, -1)) . ' & ' . end($names)
            : $names[0];
    }

    /** Display order: first day of the week (Monday first), then time. */
    public static function sortKeyFor(?array $weekdays, string $recurrence, ?string $time): int
    {
        $base = $recurrence === 'special' || ! $weekdays ? 80000 : (min(array_map(fn ($d) => ((int) $d + 6) % 7, $weekdays)) * 10000);
        if ($recurrence === 'monthly_nth_weekday') {
            $base += 70000;
        }

        return $base + ($time ? (int) str_replace(':', '', substr($time, 0, 5)) : 2359);
    }
}
