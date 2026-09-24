<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\Order;
use App\Models\Product;
use App\Models\Projet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PeexPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.peex.base_url' => 'https://peex.test/api/v1/',
            'services.peex.secret_key' => 'test-key',
            'services.peex.callback_username' => 'peex',
            'services.peex.callback_password' => 'secret',
        ]);
    }

    private function placeOrder(string $method = 'orange_money'): array
    {
        $product = Product::create(['nom' => 'Bible', 'slug' => 'bible', 'prix' => 2500, 'category' => 'Livres']);

        return $this->postJson('/api/orders', [
            'nom' => 'Doe', 'prenom' => 'Paul', 'telephone' => '655 52 99 99',
            'payment_method' => $method,
            'items' => [['product_id' => $product->id, 'qty' => 2]],
        ])->assertCreated()->json();
    }

    public function test_mobile_money_order_sends_collection_request_to_peex(): void
    {
        Http::fake(['peex.test/*' => Http::response(['id' => 5, 'status' => 'pending', 'payment_proof' => '114587'])]);

        $res = $this->placeOrder();

        $this->assertSame('peex', $res['payment']['provider']);
        $this->assertSame('en_attente', $res['payment']['status']);
        Http::assertSent(fn ($request) => $request->url() === 'https://peex.test/api/v1/collection/request_payment'
            && $request->hasHeader('SECRETKEY', 'test-key')
            && $request['phone'] === '+237655529999'
            && $request['amount'] == 5000
            && $request['country'] === 'CM'
            && $request['currency'] === 'XAF'
            && $request['track_id'] === $res['payment']['reference']
            && $request['customer_name'] === 'Paul Doe');
    }

    public function test_cash_order_stays_manual(): void
    {
        Http::fake();

        $res = $this->placeOrder('especes');

        $this->assertSame('manual', $res['payment']['provider']);
        Http::assertNothingSent();
    }

    public function test_falls_back_to_manual_when_peex_not_configured(): void
    {
        config(['services.peex.secret_key' => null]);
        Http::fake();

        $res = $this->placeOrder();

        $this->assertSame('manual', $res['payment']['provider']);
        Http::assertNothingSent();
    }

    public function test_provider_unavailable_marks_payment_failed_and_allows_retry(): void
    {
        Http::fakeSequence('peex.test/*')
            ->push(['success' => false, 'message' => 'Service Unavailable', 'details' => 'Provider unavailable'], 503)
            ->push(['id' => 6, 'status' => 'pending']);

        $res = $this->placeOrder();
        $this->assertSame('echoue', $res['payment']['status']);
        $this->assertTrue($res['payment']['can_retry']);

        $retry = $this->postJson("/api/payments/{$res['payment']['reference']}/retry")->assertOk()->json();
        $this->assertSame('en_attente', $retry['status']);
        $this->assertNotSame($res['payment']['reference'], $retry['reference']);
    }

    public function test_polling_updates_status_from_peex(): void
    {
        Http::fake(function ($request) {
            if (str_contains($request->url(), 'all_requests')) {
                parse_str(parse_url($request->url(), PHP_URL_QUERY), $query);

                return Http::response([['id' => 5, 'track_id' => $query['track_id'], 'status' => 'paid', 'payment_proof' => 'OK']]);
            }

            return Http::response(['id' => 5, 'status' => 'pending']);
        });

        $res = $this->placeOrder();
        $ref = $res['payment']['reference'];

        $this->getJson("/api/payments/{$ref}")->assertOk()->assertJson(['status' => 'paye']);
        $order = Order::first();
        $this->assertSame('paye', $order->payment_status);
        $this->assertSame('confirmee', $order->order_status);
        $this->assertNotNull($order->confirmed_at);
    }

    public function test_callback_requires_basic_auth(): void
    {
        $this->postJson('/api/payments/peex/callback', [['track_id' => 'x', 'status' => 'paid']])->assertUnauthorized();
        $this->withBasicAuth('peex', 'wrong')->postJson('/api/payments/peex/callback', [])->assertUnauthorized();
    }

    public function test_callback_marks_donation_paid_and_never_downgrades(): void
    {
        Http::fake(['peex.test/*' => Http::response(['id' => 9, 'status' => 'pending'])]);
        Sanctum::actingAs(User::factory()->create(['phone' => '677777777']));

        $res = $this->postJson('/api/donations', ['montant' => 1000, 'payment_method' => 'mtn_momo'])->assertCreated()->json();
        $ref = $res['payment']['reference'];
        Http::assertSent(fn ($r) => $r['phone'] === '+237677777777');

        $this->withBasicAuth('peex', 'secret')
            ->postJson('/api/payments/peex/callback', [['track_id' => $ref, 'status' => 'paid', 'payment_proof' => 'CI2604']])
            ->assertOk()->assertJson(['handled' => 1]);

        $this->assertSame('paye', Donation::first()->payment_status);

        $this->withBasicAuth('peex', 'secret')
            ->postJson('/api/payments/peex/callback', [['track_id' => $ref, 'status' => 'failed']])
            ->assertOk();

        $this->assertSame('paye', Donation::first()->payment_status);
    }

    public function test_donation_by_mobile_money_requires_phone(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/donations', ['montant' => 1000, 'payment_method' => 'orange_money'])
            ->assertUnprocessable()->assertJsonValidationErrors('telephone');
    }

    public function test_paid_project_donation_fills_the_progress_bar(): void
    {
        Http::fake(['peex.test/*' => Http::response(['id' => 9, 'status' => 'pending'])]);
        Sanctum::actingAs(User::factory()->create());
        $projet = Projet::create(['titre' => 'Clocher', 'slug' => 'clocher', 'objectif' => 100000, 'collecte' => 20000]);

        $res = $this->postJson('/api/donations', [
            'montant' => 5000, 'payment_method' => 'orange_money', 'telephone' => '655529999', 'projet_id' => $projet->id,
        ])->assertCreated()->json();

        Http::assertSent(fn ($r) => $r['description'] === 'Don projet : Clocher');
        $this->assertEquals(20000, $projet->fresh()->collecte, 'pending donation must not count yet');

        $this->withBasicAuth('peex', 'secret')
            ->postJson('/api/payments/peex/callback', [['track_id' => $res['payment']['reference'], 'status' => 'paid']]);
        $this->assertEquals(25000, $projet->fresh()->collecte);

        // Same notification sent twice must not count twice
        $this->withBasicAuth('peex', 'secret')
            ->postJson('/api/payments/peex/callback', [['track_id' => $res['payment']['reference'], 'status' => 'paid']]);
        $this->assertEquals(25000, $projet->fresh()->collecte);

        // Admin cancels the donation afterwards → amount is withdrawn
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));
        $this->patchJson('/api/admin/donations/' . $res['donation']['id'], ['payment_status' => 'annule'])->assertOk();
        $this->assertEquals(20000, $projet->fresh()->collecte);
    }

    public function test_cannot_donate_to_finished_project(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $projet = Projet::create(['titre' => 'Ancien', 'slug' => 'ancien', 'statut' => 'termine', 'objectif' => 1000]);

        $this->postJson('/api/donations', ['montant' => 1000, 'payment_method' => 'especes', 'projet_id' => $projet->id])
            ->assertUnprocessable()->assertJsonValidationErrors('projet_id');
    }
}
