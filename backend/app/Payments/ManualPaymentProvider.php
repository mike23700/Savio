<?php

namespace App\Payments;

use App\Models\Setting;

/**
 * No real payment gateway is wired up yet: the payer is shown manual
 * instructions (mobile money number or cash-on-visit) and an admin marks
 * the order/donation as paid from the admin panel once payment is
 * confirmed by other means (SMS, secretariat, etc).
 *
 * Swap this implementation for a real Orange Money / MTN MoMo API client
 * later without touching the Order/Donation flow: both only depend on
 * PaymentProviderInterface::initiate().
 */
class ManualPaymentProvider implements PaymentProviderInterface
{
    public function initiate(string $method, float $amount): array
    {
        $settings = Setting::allAsMap();
        $phone = $settings['parish.phone'] ?? '';

        $instructions = match ($method) {
            'orange_money' => "Envoyez {$this->formatAmount($amount)} FCFA au numéro Orange Money {$phone}, puis indiquez votre numéro de commande en objet du message de confirmation.",
            'mtn_momo' => "Envoyez {$this->formatAmount($amount)} FCFA au numéro MTN MoMo {$phone}, puis indiquez votre numéro de commande en objet du message de confirmation.",
            'especes' => "Réglez {$this->formatAmount($amount)} FCFA en espèces au secrétariat paroissial ({$settings['parish.hours']}), en mentionnant votre numéro de commande.",
            default => "Contactez le secrétariat paroissial pour finaliser le paiement de {$this->formatAmount($amount)} FCFA.",
        };

        return ['instructions' => $instructions, 'reference' => null];
    }

    private function formatAmount(float $amount): string
    {
        return number_format($amount, 0, ',', ' ');
    }
}
