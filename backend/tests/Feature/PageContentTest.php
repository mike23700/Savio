<?php

namespace Tests\Feature;

use App\Models\PageBlock;
use App\Models\PageContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageContentTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        return User::create([
            'nom' => 'Admin', 'prenom' => 'Test', 'email' => 'admin-test@savio.com',
            'password' => 'password', 'role' => 'admin',
        ]);
    }

    private function makePage(string $key): PageContent
    {
        return PageContent::create(['key' => $key, 'title' => ucfirst($key)]);
    }

    public function test_public_can_list_pages(): void
    {
        $this->makePage('genese');
        $this->makePage('savio');

        $this->getJson('/api/pages')->assertOk()->assertJsonCount(2);
    }

    public function test_unknown_page_key_returns_404(): void
    {
        $this->getJson('/api/pages/inconnu')->assertStatus(404);
    }

    public function test_guest_cannot_update_a_page(): void
    {
        $this->putJson('/api/pages/genese', ['title' => 'Hack'])->assertUnauthorized();
    }

    public function test_non_admin_cannot_update_a_page(): void
    {
        $user = User::create([
            'nom' => 'Doe', 'prenom' => 'John', 'email' => 'john@savio.com',
            'password' => 'password', 'role' => 'membre',
        ]);

        $this->actingAs($user, 'sanctum')
            ->putJson('/api/pages/genese', ['title' => 'Hack'])
            ->assertStatus(403);
    }

    public function test_admin_can_update_page_content_and_blocks(): void
    {
        $this->actingAs($this->adminUser(), 'sanctum');

        $res = $this->putJson('/api/pages/genese', [
            'title' => 'Genèse mise à jour',
            'subtitle' => 'Sous-titre',
            'intro' => 'Paragraphe **gras**.',
            'extra' => ['quote' => 'Nouvelle citation'],
            'blocks' => [
                ['kind' => 'cure', 'title' => 'Abbé Test', 'meta' => '1900 – 1910', 'description' => 'Premier curé de test', 'is_highlight' => true],
                ['kind' => 'timeline', 'title' => 'Étape', 'meta' => '1961'],
            ],
        ])->assertOk()->json();

        $this->assertSame('Genèse mise à jour', $res['title']);
        $this->assertCount(2, $res['blocks']);
        $this->assertTrue(collect($res['blocks'])->contains(fn ($b) => $b['title'] === 'Abbé Test' && $b['is_highlight']));

        $this->assertDatabaseHas('page_blocks', ['page_key' => 'genese', 'title' => 'Abbé Test', 'is_highlight' => true]);
    }

    public function test_updating_blocks_replaces_removed_ones(): void
    {
        $page = $this->makePage('caritas');
        $block = PageBlock::create(['page_key' => 'caritas', 'kind' => 'card', 'title' => 'Ancienne carte', 'sort_order' => 0]);

        $this->actingAs($this->adminUser(), 'sanctum');

        $res = $this->putJson('/api/pages/caritas', [
            'title' => 'Caritas',
            'blocks' => [
                ['kind' => 'card', 'title' => 'Nouvelle carte'],
            ],
        ])->assertOk()->json();

        $this->assertDatabaseMissing('page_blocks', ['id' => $block->id]);
        $this->assertCount(1, $res['blocks']);
        $this->assertSame('Nouvelle carte', $res['blocks'][0]['title']);
    }

    public function test_blocks_belonging_to_another_page_are_untouched(): void
    {
        $this->makePage('genese');
        $this->makePage('savio');
        $savioBlock = PageBlock::create(['page_key' => 'savio', 'kind' => 'bullet', 'title' => 'Puce savio', 'sort_order' => 0]);

        $this->actingAs($this->adminUser(), 'sanctum');

        $this->putJson('/api/pages/genese', [
            'title' => 'Genèse',
            'blocks' => [['kind' => 'cure', 'title' => 'Curé']],
        ])->assertOk();

        $this->assertDatabaseHas('page_blocks', ['id' => $savioBlock->id, 'title' => 'Puce savio']);
    }
}
