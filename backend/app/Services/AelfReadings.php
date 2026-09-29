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
        $key = "aelf:messe:v2:{$date}";

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
            'texts' => $this->texts($lectures->all()),
            'source' => 'aelf',
        ];
    }

    private const LABELS = [
        'lecture_1' => 'Première lecture',
        'psaume' => 'Psaume',
        'cantique' => 'Cantique',
        'lecture_2' => 'Deuxième lecture',
        'sequence' => 'Séquence',
        'evangile' => 'Évangile',
    ];

    /**
     * Full texts in order. Some days offer a choice between two readings of
     * the same type: the alternative is labelled "au choix".
     */
    private function texts(array $lectures): array
    {
        $texts = [];
        foreach ($lectures as $lecture) {
            $text = $this->text($lecture);
            if (! $text) {
                continue;
            }
            $previous = end($texts);
            if ($previous && $previous['type'] === $text['type']) {
                $text['label'] .= ' (au choix)';
            }
            $texts[] = $text;
        }

        return $texts;
    }

    /** Full text of one reading, its HTML reduced to a safe subset. */
    private function text(mixed $lecture): ?array
    {
        if (! is_array($lecture) || empty($lecture['contenu'])) {
            return null;
        }
        $type = (string) ($lecture['type'] ?? '');
        $str = fn (string $k) => isset($lecture[$k]) && is_string($lecture[$k]) && trim(strip_tags($lecture[$k])) !== ''
            ? $this->clean($lecture[$k]) : null;

        return [
            'type' => $type,
            'label' => self::LABELS[$type] ?? ucfirst(str_replace('_', ' ', $type)),
            'ref' => $str('ref'),
            'title' => $str('titre'),
            'intro' => $str('intro_lue'),
            'refrain' => $str('refrain_psalmique'),
            'acclamation' => isset($lecture['verset_evangile']) && is_string($lecture['verset_evangile'])
                ? $this->safeHtml($lecture['verset_evangile']) : null,
            'content' => $this->safeHtml((string) $lecture['contenu']),
            'format' => 'html',
        ];
    }

    /**
     * Keep only formatting tags and drop every attribute, so the frontend
     * can render the text as HTML without trusting the remote source.
     */
    private function safeHtml(string $html): string
    {
        $html = strip_tags($html, '<p><br><strong><b><em><i><sup><sub><span>');
        $html = preg_replace('/<(\/?)(p|br|strong|b|em|i|sup|sub|span)\b[^>]*>/i', '<$1$2>', $html);

        return trim(str_replace("\u{00A0}", ' ', $html));
    }

    private function clean(string $value): string
    {
        $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim(preg_replace('/\s+/u', ' ', str_replace("\u{00A0}", ' ', $value)));
    }
}
