<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Fetches the readings of the day from the AELF open API
 * (https://api.aelf.org), liturgical zone "afrique". Results are cached
 * per date; a failed call returns null and is only cached briefly so the
 * site retries soon after a network hiccup.
 */
class AelfReadings
{
    private const ZONE = 'afrique';

    public function forDate(string $date): ?array
    {
        $key = "aelf:messe:{$date}";

        if (($cached = Cache::get($key)) !== null) {
            return $cached ?: null;
        }

        $readings = $this->fetch($date);
        Cache::put($key, $readings ?? [], $readings ? now()->addDays(7) : now()->addMinutes(10));

        return $readings;
    }

    private function fetch(string $date): ?array
    {
        try {
            $response = Http::timeout(6)->acceptJson()->get("https://api.aelf.org/v1/messes/{$date}/" . self::ZONE);
        } catch (\Throwable) {
            return null;
        }

        if (! $response->ok()) {
            return null;
        }

        $info = $response->json('informations') ?? [];
        $lectures = collect($response->json('messes.0.lectures') ?? []);
        $ref = function (string $type) use ($lectures) {
            $ref = $lectures->firstWhere('type', $type)['ref'] ?? null;

            return $ref ? $this->clean($ref) : null;
        };
        $gospel = $lectures->firstWhere('type', 'evangile');

        if ($lectures->isEmpty()) {
            return null;
        }

        $day = trim(implode(' — ', array_filter([$info['ligne1'] ?? null, $info['fete'] ?? null])));

        return [
            'date' => $date,
            'liturgical_day' => $day !== '' ? $this->clean($day) : null,
            'color' => $info['couleur'] ?? null,
            'reading_1' => $ref('lecture_1'),
            'psalm' => $ref('psaume'),
            'reading_2' => $ref('lecture_2'),
            'gospel' => $ref('evangile'),
            'gospel_title' => isset($gospel['titre']) ? $this->clean($gospel['titre']) : null,
            'source' => 'aelf',
        ];
    }

    private function clean(string $value): string
    {
        $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim(preg_replace('/\s+/u', ' ', str_replace("\u{00A0}", ' ', $value)));
    }
}
