<?php

namespace Tests\Feature;

use App\Models\DailyReading;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DailyReadingTest extends TestCase
{
    use RefreshDatabase;

    public function test_aelf_texts_are_returned_with_sanitized_html(): void
    {
        Http::fake(['api.aelf.org/*' => Http::response([
            'informations' => ['ligne1' => 'Saint Michel', 'fete' => 'Fête', 'couleur' => 'blanc'],
            'messes' => [['lectures' => [
                ['type' => 'lecture_1', 'ref' => 'Dn 7, 9-10', 'titre' => 'Des millions', 'intro_lue' => 'Lecture du livre de Daniel',
                    'contenu' => '<p onclick="x()">La nuit,<br />je regardais<script>alert(1)</script></p>'],
                ['type' => 'evangile', 'ref' => 'Jn 1, 47-51', 'titre' => 'Vous verrez', 'contenu' => '<p>En ce temps-là</p>',
                    'verset_evangile' => '<p><strong>Alléluia.</strong></p>'],
            ]]],
        ])]);

        $res = $this->getJson('/api/lectures/jour?date=2026-09-29')->assertOk()->json();

        $this->assertSame('aelf', $res['source']);
        $this->assertCount(2, $res['texts']);
        $this->assertSame('Première lecture', $res['texts'][0]['label']);
        $this->assertSame('<p>La nuit,<br>je regardaisalert(1)</p>', $res['texts'][0]['content']);
        $this->assertSame('<p><strong>Alléluia.</strong></p>', $res['texts'][1]['acclamation']);
    }

    public function test_parish_entry_exposes_its_own_texts(): void
    {
        Http::fake();
        DailyReading::create(['date' => '2026-10-04', 'gospel' => 'Mt 21, 33-43', 'gospel_text' => "En ce temps-là,\nJésus disait"]);

        $res = $this->getJson('/api/lectures/jour?date=2026-10-04')->assertOk()->json();

        $this->assertSame('paroisse', $res['source']);
        $this->assertSame([['type' => 'evangile', 'label' => 'Évangile', 'ref' => 'Mt 21, 33-43', 'title' => null, 'intro' => null,
            'refrain' => null, 'acclamation' => null, 'content' => "En ce temps-là,\nJésus disait", 'format' => 'text']], $res['texts']);
        Http::assertNothingSent();
    }
}
