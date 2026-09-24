<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Payments\PaymentService;
use App\Payments\PeexPaymentProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Payment attempts are addressed by their unguessable reference (Peex
 * track_id), so guests who ordered without an account can follow theirs.
 */
class PaymentController extends Controller
{
    public function show(string $reference, PaymentService $payments)
    {
        $payable = $payments->findByReference($reference);
        abort_unless($payable, 404, 'Paiement introuvable.');

        $payments->refresh($payable);

        return response()->json($payments->payload($payable));
    }

    public function retry(Request $request, string $reference, PaymentService $payments)
    {
        $data = $request->validate(['telephone' => 'nullable|string|max:30']);

        $payable = $payments->findByReference($reference);
        abort_unless($payable, 404, 'Paiement introuvable.');
        abort_unless($payable->payment_status === 'echoue', 422, 'Ce paiement ne peut pas être relancé.');

        if (! empty($data['telephone'])) {
            $payable->telephone = $data['telephone'];
        }

        return response()->json($payments->start($payable));
    }

    /**
     * Peex webhook (https://peex-api-docs.peexit.com/notifications): a POST,
     * secured by Basic Auth, whose body is an array of finalized transactions.
     */
    public function peexCallback(Request $request, PaymentService $payments)
    {
        $username = (string) config('services.peex.callback_username');
        $password = (string) config('services.peex.callback_password');

        if ($username === '' || $password === ''
            || ! hash_equals($username, (string) $request->getUser())
            || ! hash_equals($password, (string) $request->getPassword())) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $rows = $request->json()->all();
        if (isset($rows['track_id'])) {
            $rows = [$rows];
        }

        $handled = 0;
        foreach ($rows as $row) {
            $trackId = is_array($row) ? ($row['track_id'] ?? null) : null;
            $status = is_array($row) ? ($row['status'] ?? null) : null;
            if (! is_string($trackId) || ! is_string($status)) {
                continue;
            }

            $payable = $payments->findByReference($trackId);
            if (! $payable) {
                Log::info('Peex callback for unknown track_id', ['track_id' => $trackId]);
                continue;
            }

            $details = $row['payment_proof'] ?? $row['message'] ?? null;
            $payments->applyStatus($payable, PeexPaymentProvider::mapStatus($status), $status, is_string($details) ? $details : null);
            $handled++;
        }

        return response()->json(['received' => count($rows), 'handled' => $handled]);
    }
}
