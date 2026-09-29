<?php

namespace Tests\Feature;

use App\Models\IntentionMesse;
use App\Models\MassSchedule;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IntentionMesseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        MassSchedule::create(['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '07:00', 'type' => 'Messe', 'counts_as_mass' => true]);
        MassSchedule::create(['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '11:00', 'type' => 'Messe principale', 'counts_as_mass' => true]);
        MassSchedule::create(['group_label' => 'Dimanche', 'weekdays' => [0], 'recurrence_type' => 'weekly', 'time' => '15:00', 'type' => 'Confessions', 'counts_as_mass' => false]);
    }

    private function nextSunday(): string
    {
        return Carbon::today()->next(Carbon::SUNDAY)->toDateString();
    }

    private function send(array $extra)
    {
        return $this->postJson('/api/intentions', [
            'nom' => 'Doe', 'prenom' => 'Paul', 'telephone' => '655529999', 'description' => 'Action de grâce', ...$extra,
        ]);
    }

    public function test_lists_only_masses_of_the_chosen_day(): void
    {
        $this->getJson('/api/mass-schedule/day?date=' . $this->nextSunday())
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.time', '07h00')
            ->assertJsonPath('1.type', 'Messe principale');
    }

    public function test_stores_the_chosen_mass(): void
    {
        $this->send(['date_souhaitee' => $this->nextSunday(), 'heure_souhaitee' => '11h00'])->assertCreated();

        $intention = IntentionMesse::first();
        $this->assertSame('11h00', $intention->heure_souhaitee);
        $this->assertSame('Messe principale', $intention->messe_type);
    }

    public function test_rejects_a_time_without_mass(): void
    {
        $this->send(['date_souhaitee' => $this->nextSunday(), 'heure_souhaitee' => '15h00'])
            ->assertStatus(422)->assertJsonValidationErrors('heure_souhaitee');
        $this->send(['date_souhaitee' => $this->nextSunday()])
            ->assertStatus(422)->assertJsonValidationErrors('heure_souhaitee');
    }

    public function test_date_without_any_mass_is_accepted_without_time(): void
    {
        $monday = Carbon::today()->next(Carbon::MONDAY)->toDateString();
        $this->send(['date_souhaitee' => $monday])->assertCreated();
        $this->assertNull(IntentionMesse::first()->heure_souhaitee);
    }
}
