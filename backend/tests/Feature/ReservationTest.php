<?php

namespace Tests\Feature;

use App\Models\Espace;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.peex.secret_key' => null]);
        Http::fake();
    }

    private function room(array $attrs = []): Espace
    {
        return Espace::create(['kind' => 'chambre', 'nom' => 'Chambre double', 'slug' => 'chambre-double', 'capacite' => 2, 'quantite' => 2, 'prix' => 15000, ...$attrs]);
    }

    private function hall(array $attrs = []): Espace
    {
        return Espace::create(['kind' => 'salle', 'nom' => 'Grande salle', 'slug' => 'grande-salle', 'capacite' => 300, 'quantite' => 1, 'prix' => 100000, ...$attrs]);
    }

    private function book(Espace $espace, string $debut, string $fin, array $extra = [])
    {
        return $this->postJson('/api/reservations', [
            'espace_id' => $espace->id, 'nom' => 'Doe', 'prenom' => 'Paul', 'telephone' => '655529999',
            'date_debut' => $debut, 'date_fin' => $fin, 'payment_method' => 'especes', ...$extra,
        ]);
    }

    private function day(int $offset): string
    {
        return now()->addDays($offset)->toDateString();
    }

    public function test_room_booking_is_priced_per_night_and_starts_payment(): void
    {
        $res = $this->book($this->room(), $this->day(3), $this->day(5), ['nb_unites' => 2])->assertCreated()->json();

        $this->assertSame(15000 * 2 * 2, $res['reservation']['montant']);
        $this->assertSame('manual', $res['payment']['provider']);
        $this->assertStringStartsWith('RES-', $res['payment']['reference']);
    }

    public function test_room_units_run_out_but_departure_day_is_free_again(): void
    {
        $room = $this->room();
        $this->book($room, $this->day(3), $this->day(5), ['nb_unites' => 2])->assertCreated();

        $this->book($room, $this->day(4), $this->day(6))->assertStatus(422)->assertJsonValidationErrors('date_debut');
        // checkout day of the first stay = check-in day of the next one
        $this->book($room, $this->day(5), $this->day(6))->assertCreated();
    }

    public function test_hall_is_billed_per_day_inclusive_and_blocks_its_last_day(): void
    {
        $hall = $this->hall();
        $res = $this->book($hall, $this->day(10), $this->day(11))->assertCreated()->json();
        $this->assertSame(200000, $res['reservation']['montant']);

        $this->book($hall, $this->day(11), $this->day(11))->assertStatus(422);
        $this->getJson('/api/espaces/grande-salle')->assertOk()->assertJson(['jours_complets' => [$this->day(10), $this->day(11)]]);
    }

    public function test_cancelled_booking_releases_dates(): void
    {
        $hall = $this->hall();
        $this->book($hall, $this->day(10), $this->day(10))->assertCreated();
        Reservation::first()->update(['statut' => 'annulee']);

        $this->book($hall, $this->day(10), $this->day(10))->assertCreated();
    }

    public function test_abandoned_mobile_money_attempt_stops_holding_dates(): void
    {
        $hall = $this->hall();
        $this->book($hall, $this->day(10), $this->day(10))->assertCreated();
        Reservation::first()->forceFill(['payment_provider' => 'peex', 'created_at' => now()->subHours(2)])->save();

        $this->book($hall, $this->day(10), $this->day(10))->assertCreated();
    }

    public function test_price_on_request_creates_request_without_payment(): void
    {
        $res = $this->book($this->hall(['prix' => null]), $this->day(10), $this->day(10), ['payment_method' => null, 'evenement' => 'Mariage'])
            ->assertCreated()->json();

        $this->assertNull($res['payment']);
        $this->assertNull($res['reservation']['montant']);
    }

    public function test_rejects_past_dates_and_too_many_guests(): void
    {
        $room = $this->room();
        $this->book($room, $this->day(-5), $this->day(-3))->assertStatus(422)->assertJsonValidationErrors('date_debut');
        $this->book($room, $this->day(1), $this->day(1))->assertStatus(422)->assertJsonValidationErrors('date_fin');
        $this->book($room, $this->day(1), $this->day(2), ['nb_personnes' => 3])->assertStatus(422)->assertJsonValidationErrors('nb_personnes');
    }

    public function test_availability_endpoint_returns_quote(): void
    {
        $this->room();
        $this->getJson('/api/espaces/chambre-double/disponibilite?debut=' . $this->day(1) . '&fin=' . $this->day(4) . '&unites=1')
            ->assertOk()
            ->assertJson(['duree' => 3, 'disponible' => true, 'unites_restantes' => 2, 'montant' => 45000]);
    }

    public function test_admin_marking_paid_confirms_the_booking(): void
    {
        $this->book($this->hall(), $this->day(10), $this->day(10))->assertCreated();
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $reservation = Reservation::first();
        $this->patchJson("/api/admin/reservations/{$reservation->id}", ['payment_status' => 'paye'])
            ->assertOk()
            ->assertJson(['payment_status' => 'paye', 'statut' => 'confirmee']);
    }
}
