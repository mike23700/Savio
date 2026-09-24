<?php

namespace App\Payments;

use App\Models\Donation;
use App\Models\Order;
use Illuminate\Support\Str;

/**
 * Single entry point for the Order/Donation flow. Cash always goes through
 * the manual provider; mobile money goes through Peex when it is configured
 * (PEEX_SECRET_KEY), otherwise falls back to manual instructions.
 */
class PaymentService
{
    public function __construct(
        private ManualPaymentProvider $manual,
        private PeexPaymentProvider $peex,
    ) {
    }

    /** Start a new payment attempt (first try or retry) and persist its state. */
    public function start(Order|Donation $payable): array
    {
        $provider = $this->providerForMethod($payable->payment_method);
        $reference = $this->newReference($payable);

        $result = $provider->initiate(new PaymentRequest(
            method: $payable->payment_method,
            amount: (float) $payable->paymentAmount(),
            reference: $reference,
            phone: self::normalizePhone($payable->telephone),
            customerName: $payable->paymentCustomerName(),
            description: $payable->paymentDescription(),
        ));

        $payable->forceFill([
            'payment_reference' => $reference,
            'payment_provider' => $provider->name(),
            'payment_status' => 'en_attente',
            'payment_provider_status' => $result['provider_status'],
            'payment_details' => $result['details'],
        ])->save();

        $this->applyStatus($payable, $result['status'], $result['provider_status'], $result['details']);

        return $this->payload($payable, $result['instructions']);
    }

    /** Re-check a pending attempt with its provider (used by the polling endpoint). */
    public function refresh(Order|Donation $payable): void
    {
        if ($payable->payment_status !== 'en_attente' || ! $payable->payment_reference) {
            return;
        }

        $provider = $payable->payment_provider === 'peex' ? $this->peex : $this->manual;
        $state = $provider->fetchStatus($payable->payment_reference);

        if ($state) {
            $this->applyStatus($payable, $state['status'], $state['provider_status'], $state['details']);
        }
    }

    /**
     * Apply a provider-reported status. Never overrides a final decision
     * (paid, or cancelled by an admin).
     */
    public function applyStatus(Order|Donation $payable, string $status, ?string $providerStatus, ?string $details): void
    {
        if (in_array($payable->payment_status, ['paye', 'annule'], true)) {
            return;
        }

        $payable->payment_status = $status;
        $payable->payment_provider_status = $providerStatus;
        $payable->payment_details = $details;

        if ($status === 'paye') {
            $payable->confirmed_at = now();
            if ($payable instanceof Order && $payable->order_status === 'en_attente') {
                $payable->order_status = 'confirmee';
            }
        }

        $payable->save();
    }

    public function findByReference(string $reference): Order|Donation|null
    {
        return Order::where('payment_reference', $reference)->first()
            ?? Donation::where('payment_reference', $reference)->first();
    }

    /** What the frontend needs to display/poll a payment. */
    public function payload(Order|Donation $payable, ?string $instructions = null): array
    {
        return [
            'reference' => $payable->payment_reference,
            'provider' => $payable->payment_provider,
            'status' => $payable->payment_status,
            'provider_status' => $payable->payment_provider_status,
            'instructions' => $instructions,
            'can_retry' => $payable->payment_status === 'echoue' && $payable->payment_provider === 'peex',
        ];
    }

    public function providerForMethod(string $method): PaymentProviderInterface
    {
        if (in_array($method, ['orange_money', 'mtn_momo'], true) && $this->peex->isConfigured()) {
            return $this->peex;
        }

        return $this->manual;
    }

    /**
     * Normalise a Cameroonian number to E.164 as Peex requires
     * ("655 52 99 99" → "+237655529999").
     */
    public static function normalizePhone(?string $raw): ?string
    {
        if (! $raw) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $raw);
        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }
        if (strlen($digits) === 9) {
            $digits = config('services.peex.dial_code', '237') . $digits;
        }

        return '+' . $digits;
    }

    public static function formatAmount(float $amount): string
    {
        return number_format($amount, 0, ',', ' ');
    }

    private function newReference(Order|Donation $payable): string
    {
        $base = $payable instanceof Order ? $payable->order_number : 'DON-' . $payable->id;

        return $base . '-' . Str::upper(Str::random(4));
    }
}
