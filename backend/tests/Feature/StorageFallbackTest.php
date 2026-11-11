<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StorageFallbackTest extends TestCase
{
    public function test_it_serves_files_from_the_public_disk(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('team/test.txt', 'hello-storage');

        $this->get('/storage/team/test.txt')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=utf-8');
    }

    public function test_it_returns_404_for_a_missing_file(): void
    {
        Storage::fake('public');

        $this->get('/storage/team/missing.txt')->assertNotFound();
    }

    public function test_it_rejects_path_traversal(): void
    {
        Storage::fake('public');

        $this->get('/storage/..%2F.env')->assertNotFound();
    }
}
