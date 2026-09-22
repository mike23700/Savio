<?php

namespace App\Payments;

interface PaymentProviderInterface
{
    /**
     * Start a payment attempt for the given amount/method and return
     * instructions (and optionally a reference) to show the payer.
     *
     * @return array{instructions: string, reference: ?string}
     */
    public function initiate(string $method, float $amount): array;
}
