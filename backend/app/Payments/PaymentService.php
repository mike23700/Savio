<?php

namespace App\Payments;

class PaymentService
{
    public function __construct(private PaymentProviderInterface $provider)
    {
    }

    public function initiate(string $method, float $amount): array
    {
        return $this->provider->initiate($method, $amount);
    }
}
