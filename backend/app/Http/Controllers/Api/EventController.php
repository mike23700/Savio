<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    // ── Public ────────────────────────────────────────────────────────────

    /**
     * Published events, chronological. `?from=YYYY-MM-DD` (the visitor's
     * local date) hides events that are over — a multi-day event stays
     * "upcoming" until its last day (`end_date`); `?past=1` lists the events
     * that are over instead, most recent first.
     */
    public function index(Request $request)
    {
        $query = Event::with('category')->where('is_published', true);

        $from = $request->query('from');
        if (is_string($from) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)) {
            if ($request->boolean('past')) {
                $query->whereRaw('COALESCE(end_date, date) < ?', [$from])
                    ->orderByDesc('date')->orderByDesc('time');
            } else {
                $query->whereRaw('COALESCE(end_date, date) >= ?', [$from])
                    ->orderBy('date')->orderBy('time');
            }
        } else {
            $query->orderBy('date')->orderBy('time');
        }

        if ($limit = (int) $request->query('limit')) {
            $query->limit($limit);
        }

        return response()->json($query->get());
    }

    public function categories()
    {
        return response()->json(EventCategory::orderBy('sort_order')->orderBy('name')->get());
    }

    // ── Admin: events ─────────────────────────────────────────────────────

    public function adminIndex()
    {
        return response()->json(Event::with('category')->orderByDesc('date')->orderBy('time')->get());
    }

    public function store(Request $request)
    {
        return response()->json(Event::create($this->validated($request))->load('category'), 201);
    }

    public function update(Request $request, Event $event)
    {
        $event->update($this->validated($request));

        return response()->json($event->load('category'));
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'event_category_id' => 'nullable|exists:event_categories,id',
            'title' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'nullable|date_format:H:i',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:date',
            'end_time' => 'nullable|date_format:H:i',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
        ], [
            'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
        ]);

        // A "multi-day" event ending on its start day is just a one-day event.
        if (($data['end_date'] ?? null) === $data['date']) {
            $data['end_date'] = null;
        }
        if (empty($data['end_date'] ?? null) && empty($data['time'] ?? null)) {
            $data['end_time'] = null;
        }

        return $data;
    }

    // ── Admin: categories ─────────────────────────────────────────────────

    public function storeCategory(Request $request)
    {
        return response()->json(EventCategory::create($this->validatedCategory($request)), 201);
    }

    public function updateCategory(Request $request, EventCategory $category)
    {
        $category->update($this->validatedCategory($request, $category));

        return response()->json($category);
    }

    public function destroyCategory(EventCategory $category)
    {
        $category->delete();

        return response()->json(null, 204);
    }

    private function validatedCategory(Request $request, ?EventCategory $current = null): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'sort_order' => 'integer',
        ]);
        $data['slug'] = Str::slug($data['name']);
        $data['color'] = $data['color'] ?? '#0B3D91';

        validator($data, [
            'slug' => [Rule::unique('event_categories', 'slug')->ignore($current?->id)],
        ], ['slug.unique' => 'Une catégorie porte déjà ce nom.'])->validate();

        return $data;
    }
}
