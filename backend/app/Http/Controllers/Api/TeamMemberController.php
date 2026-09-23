<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(TeamMember::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function show(string $slug)
    {
        return response()->json(TeamMember::where('slug', $slug)->where('is_active', true)->firstOrFail());
    }

    public function adminIndex()
    {
        return response()->json(TeamMember::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $base = Str::slug($data['name']);
        $slug = $base;
        for ($i = 2; TeamMember::where('slug', $slug)->exists(); $i++) {
            $slug = "{$base}-{$i}";
        }
        $data['slug'] = $slug;

        return response()->json(TeamMember::create($data), 201);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $data = $this->validated($request);

        if (($data['photo'] ?? null) !== $teamMember->photo) {
            $this->deleteStoredImage($teamMember->photo);
        }

        $teamMember->update($data);

        return response()->json($teamMember);
    }

    public function destroy(TeamMember $teamMember)
    {
        $this->deleteStoredImage($teamMember->photo);
        $teamMember->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'photo' => 'nullable|string|max:500',
            'since' => 'nullable|string|max:50',
            'origin' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'motto' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'born' => 'nullable|string|max:255',
            'ordained' => 'nullable|string|max:255',
            'ordained_by' => 'nullable|string|max:255',
            'ministries' => 'nullable|array',
            'ministries.*' => 'string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path && ! preg_match('#^https?://#', $path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
