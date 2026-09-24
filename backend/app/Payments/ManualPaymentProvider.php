<?php

namespace App\Payments;

use App\Models\Setting;

/**
 * Fallback when no gateway applies (cash) or Peex is not configured: the
 * payer is shown manual instructions and an admin marks the order/donation
 * as paid from the admin panel once payment is confirmed by other means.
 */
class ManualPaymentProvider implements PaymentProviderInterface
{
    public function name(): string
    {
        return 'manual';
    }

    public function initiate(PaymentRequest $request): array
    {
        $settings = Setting::allAsMap();
        $phone = $settings['parish.phone'] ?? '';
        $amount = PaymentService::formatAmount($request->amount);
        $ref = $request->reference;

        $instructions = match ($request->method) {
            'orange_money' => "Envoyez {$amount} FCFA au numéro Orange Money {$phone}, en indiquant la référence {$ref} en objet du message de confirmation.",
            'mtn_momo' => "Envoyez {$amount} FCFA au numéro MTN MoMo {$phone}, en indiquant la référence {$ref} en objet du message de confirmation.",
            'especes' => "Réglez {$amount} FCFA en espèces au secrétariat paroissial (" . ($settings['parish.hours'] ?? '') . "), en mentionnant la référence {$ref}.",
            default => "Contactez le secrétariat paroissial pour finaliser le paiement de {$amount} FCFA (référence {$ref}).",
        };

        return ['status' => 'en_attente', 'instructions' => $instructions, 'provider_status' => null, 'details' => null];
    }

    public function fetchStatus(string $reference): ?array
    {
        return null;
    }
}
