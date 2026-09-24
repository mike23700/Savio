<?php

namespace App\Payments;

/**
 * Everything a provider needs to start a payment attempt. `reference` is
 * unique per attempt (it becomes Peex's `track_id`) and is stored as the
 * order/donation `payment_reference`.
 */
final class PaymentRequest
{
    public function __construct(
        public readonly string $method,
        public readonly float $amount,
        public readonly string $reference,
        public readonly ?string $phone,
        public readonly string $customerName,
        public readonly string $description,
    ) {
    }
}
