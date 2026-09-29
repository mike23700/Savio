<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyReading extends Model
{
    protected $fillable = [
        'date', 'liturgical_day', 'reading_1', 'reading_1_text', 'psalm', 'psalm_text',
        'reading_2', 'reading_2_text', 'gospel', 'gospel_text', 'gospel_title',
    ];

    /** Readings the parish typed in (plain text), shaped like AelfReadings::fetch()['texts']. */
    public function texts(): array
    {
        $parts = [
            ['lecture_1', 'Première lecture', $this->reading_1, $this->reading_1_text],
            ['psaume', 'Psaume', $this->psalm, $this->psalm_text],
            ['lecture_2', 'Deuxième lecture', $this->reading_2, $this->reading_2_text],
            ['evangile', 'Évangile', $this->gospel, $this->gospel_text],
        ];

        return collect($parts)
            ->filter(fn ($p) => filled($p[3]))
            ->map(fn ($p) => [
                'type' => $p[0],
                'label' => $p[1],
                'ref' => $p[2],
                'title' => $p[0] === 'evangile' ? $this->gospel_title : null,
                'intro' => null,
                'refrain' => null,
                'acclamation' => null,
                'content' => $p[3],
                'format' => 'text',
            ])
            ->values()
            ->all();
    }

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }
}
