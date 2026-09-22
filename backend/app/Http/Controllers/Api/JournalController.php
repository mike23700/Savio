<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalIssue;
use App\Models\JournalSubscription;
use App\Models\JournalTarif;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    public function tarifs()
    {
        return response()->json(JournalTarif::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function issues()
    {
        return response()->json(JournalIssue::orderByDesc('published_at')->take(20)->get());
    }

    public function mySubscription(Request $request)
    {
        $sub = JournalSubscription::where('user_id', $request->user()->id)->with('tarif')->latest()->first();

        return response()->json($sub);
    }

    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'tarif_id' => 'required|exists:journal_tarifs,id',
            'format' => 'required|in:electronique,papier',
        ]);

        $sub = JournalSubscription::create([
            'user_id' => $request->user()->id,
            'tarif_id' => $data['tarif_id'],
            'format' => $data['format'],
            'status' => 'active',
            'started_at' => now()->toDateString(),
        ]);

        return response()->json($sub->load('tarif'), 201);
    }

    // ── Admin: tarifs CRUD ─────────────────────────────────────────────
    public function adminTarifs()
    {
        return response()->json(JournalTarif::orderBy('sort_order')->get());
    }

    public function storeTarif(Request $request)
    {
        return response()->json(JournalTarif::create($this->validatedTarif($request)), 201);
    }

    public function updateTarif(Request $request, JournalTarif $tarif)
    {
        $tarif->update($this->validatedTarif($request));

        return response()->json($tarif);
    }

    public function destroyTarif(JournalTarif $tarif)
    {
        $tarif->delete();

        return response()->json(null, 204);
    }

    // ── Admin: issues CRUD ─────────────────────────────────────────────
    public function adminIssues()
    {
        return response()->json(JournalIssue::orderByDesc('published_at')->get());
    }

    public function storeIssue(Request $request)
    {
        return response()->json(JournalIssue::create($this->validatedIssue($request)), 201);
    }

    public function updateIssue(Request $request, JournalIssue $issue)
    {
        $issue->update($this->validatedIssue($request));

        return response()->json($issue);
    }

    public function destroyIssue(JournalIssue $issue)
    {
        $issue->delete();

        return response()->json(null, 204);
    }

    // ── Admin: subscriptions (per-user activate/deactivate) ────────────
    public function adminSubscriptions()
    {
        return response()->json(
            JournalSubscription::with(['user:id,nom,prenom,email', 'tarif'])->latest()->get()
        );
    }

    public function toggleSubscription(Request $request, JournalSubscription $subscription)
    {
        $data = $request->validate(['status' => 'required|in:active,inactive']);

        $update = ['status' => $data['status']];
        if ($data['status'] === 'inactive') {
            $update['deactivated_by_user_id'] = $request->user()->id;
            $update['deactivated_at'] = now();
        } else {
            $update['deactivated_by_user_id'] = null;
            $update['deactivated_at'] = null;
        }

        $subscription->update($update);

        return response()->json($subscription->fresh(['user:id,nom,prenom,email', 'tarif']));
    }

    private function validatedTarif(Request $request): array
    {
        return $request->validate([
            'label' => 'required|string|max:100',
            'price_label' => 'required|string|max:50',
            'issues' => 'required|integer|min:1',
            'period' => 'required|string|max:50',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }

    private function validatedIssue(Request $request): array
    {
        return $request->validate([
            'numero' => 'required|string|max:50',
            'theme' => 'nullable|string|max:255',
            'published_at' => 'required|date',
            'pdf_url' => 'nullable|string|max:500',
        ]);
    }
}
