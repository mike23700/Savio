<?php

namespace App\Payments;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Mobile money collection (Orange Money / MTN MoMo) through the Peex
 * "Collect" API: https://peex-api-docs.peexit.com/collect/collections
 *
 * The payer receives a push/USSD prompt on their phone; the final status
 * comes back through the webhook (PaymentController::peexCallback) or by
 * polling GET /collection/all_requests?track_id=…
 *
 * Note: in sandbox, Peex always collects a fixed 10 FCFA whatever the amount.
 */
class PeexPaymentProvider implements PaymentProviderInterface
{
    public function name(): string
    {
        return 'peex';
    }

    public function isConfigured(): bool
    {
        return filled(config('services.peex.secret_key'));
    }

    public function initiate(PaymentRequest $request): array
    {
        $amount = PaymentService::formatAmount($request->amount);

        try {
            $response = $this->client()->post('collection/request_payment', [
                'track_id' => $request->reference,
                'phone' => $request->phone,
                'amount' => $request->amount,
                'currency' => config('services.peex.currency'),
                'customer_name' => $request->customerName,
                'country' => config('services.peex.country'),
                'description' => $request->description,
            ]);
            $body = $response->json() ?? [];
        } catch (ConnectionException $e) {
            Log::warning('Peex request_payment unreachable', ['reference' => $request->reference, 'error' => $e->getMessage()]);

            return $this->failure('unreachable', 'Le service de paiement est momentanément injoignable.');
        }

        $providerStatus = $body['status'] ?? null;

        if ($response->failed() || ($body['success'] ?? null) === false || ! is_string($providerStatus)) {
            $message = $body['details'] ?? $body['message'] ?? $body['error']['message'] ?? $response->reason();
            Log::warning('Peex request_payment refused', ['reference' => $request->reference, 'http' => $response->status(), 'body' => $body]);

            return $this->failure(is_string($providerStatus) ? $providerStatus : 'error', is_string($message) ? $message : 'Demande refusée.');
        }

        $status = self::mapStatus($providerStatus);

        return [
            'status' => $status,
            'provider_status' => $providerStatus,
            'details' => $body['payment_proof'] ?? null,
            'instructions' => $status === 'echoue'
                ? "Le paiement n'a pas pu être lancé. Vérifiez le numéro et réessayez."
                : "Une demande de paiement de {$amount} FCFA a été envoyée au {$request->phone}. Validez-la sur votre téléphone avec votre code secret (si rien ne s'affiche : #150*50# pour Orange Money, *126# pour MTN MoMo).",
        ];
    }

    public function fetchStatus(string $reference): ?array
    {
        try {
            $response = $this->client()->get('collection/all_requests', ['track_id' => $reference]);
        } catch (ConnectionException $e) {
            return null;
        }

        if ($response->failed()) {
            return null;
        }

        // The docs show a single object; the polling example treats it as a list.
        $body = $response->json();
        $rows = isset($body['track_id']) ? [$body] : (array) ($body['data'] ?? $body ?? []);
        $row = collect($rows)->first(fn ($r) => is_array($r) && ($r['track_id'] ?? null) === $reference);

        if (! $row || ! is_string($row['status'] ?? null)) {
            return null;
        }

        return [
            'status' => self::mapStatus($row['status']),
            'provider_status' => $row['status'],
            'details' => $row['payment_proof'] ?? null,
        ];
    }

    /** Peex status (new, pending, paid, failed, canceled, rejected) → our payment_status. */
    public static function mapStatus(string $peexStatus): string
    {
        return match (strtolower($peexStatus)) {
            'paid' => 'paye',
            'failed', 'canceled', 'cancelled', 'rejected' => 'echoue',
            default => 'en_attente',
        };
    }

    private function failure(string $providerStatus, string $details): array
    {
        return [
            'status' => 'echoue',
            'provider_status' => $providerStatus,
            'details' => $details,
            'instructions' => "Le paiement n'a pas pu être lancé : {$details} Vous pouvez réessayer.",
        ];
    }

    private function client(): PendingRequest
    {
        return Http::baseUrl(config('services.peex.base_url'))
            ->withHeaders(['SECRETKEY' => config('services.peex.secret_key')])
            ->acceptJson()
            ->asJson()
            ->timeout((int) config('services.peex.timeout', 30));
    }
}
