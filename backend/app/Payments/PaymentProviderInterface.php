<?php

namespace App\Payments;

interface PaymentProviderInterface
{
    /** Short identifier stored in `payment_provider` (e.g. "manual", "peex"). */
    public function name(): string;

    /**
     * Start a payment attempt and return what to show the payer.
     *
     * `status` is one of our own payment statuses (en_attente, paye, echoue);
     * `provider_status` / `details` are the raw provider values kept for the admin.
     *
     * @return array{status: string, instructions: string, provider_status: ?string, details: ?string}
     */
    public function initiate(PaymentRequest $request): array;

    /**
     * Ask the provider for the current state of an attempt, or null when the
     * provider has no way to know (manual payments) or could not be reached.
     *
     * @return array{status: string, provider_status: string, details: ?string}|null
     */
    public function fetchStatus(string $reference): ?array;
}
