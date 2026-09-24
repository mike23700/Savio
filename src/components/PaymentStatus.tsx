import { useEffect, useState } from "react";
import { apiGet, apiPost, ApiError } from "@/lib/api";

export interface PaymentInfo {
  reference: string;
  provider: "peex" | "manual";
  status: "en_attente" | "paye" | "echoue" | "annule";
  provider_status: string | null;
  instructions: string | null;
  can_retry: boolean;
}

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

const font = { fontFamily: "Montserrat, sans-serif" };

/**
 * Shows the payment instructions and, for Peex mobile money payments, polls
 * the API until the payer validates (or refuses) the request on their phone.
 */
export default function PaymentStatus({ initial }: { initial: PaymentInfo }) {
  const [payment, setPayment] = useState(initial);
  const [instructions, setInstructions] = useState(initial.instructions);
  const [timedOut, setTimedOut] = useState(false);
  const [retryPhone, setRetryPhone] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const polling = payment.provider === "peex" && payment.status === "en_attente" && !timedOut;

  useEffect(() => {
    if (!polling) return;
    const startedAt = Date.now();
    const timer = setInterval(async () => {
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      try {
        setPayment(await apiGet<PaymentInfo>(`/payments/${encodeURIComponent(payment.reference)}`));
      } catch {
        // transient network error: keep polling
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [polling, payment.reference]);

  async function retry() {
    setRetrying(true);
    setError(null);
    try {
      const next = await apiPost<PaymentInfo>(`/payments/${encodeURIComponent(payment.reference)}/retry`, {
        telephone: retryPhone || null,
      });
      setPayment(next);
      setInstructions(next.instructions);
      setTimedOut(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setRetrying(false);
    }
  }

  if (payment.status === "paye") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
        <p style={{ ...font, fontSize: "0.85rem", color: "#166534", fontWeight: 700 }}>✅ Paiement confirmé</p>
        <p style={{ ...font, fontSize: "0.75rem", color: "#166534", marginTop: 4 }}>Référence : {payment.reference}</p>
      </div>
    );
  }

  if (payment.status === "echoue" || payment.status === "annule") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left space-y-3">
        <p style={{ ...font, fontSize: "0.85rem", color: "#991b1b", fontWeight: 700 }}>
          {payment.status === "annule" ? "Paiement annulé" : "Le paiement n'a pas abouti"}
        </p>
        {instructions && payment.status === "echoue" && (
          <p style={{ ...font, fontSize: "0.78rem", color: "#991b1b", lineHeight: 1.6 }}>{instructions}</p>
        )}
        {payment.can_retry && (
          <>
            <input value={retryPhone} onChange={e => setRetryPhone(e.target.value)}
              placeholder="Autre numéro (optionnel)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" />
            {error && <p style={{ ...font, fontSize: "0.78rem", color: "#991b1b" }}>{error}</p>}
            <button onClick={retry} disabled={retrying}
              style={{ ...font, background: "#0B3D91", fontWeight: 700, fontSize: "0.8rem" }}
              className="w-full text-white py-2.5 rounded-xl hover:opacity-90 disabled:opacity-60">
              {retrying ? "Envoi…" : "Réessayer le paiement"}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2">
      {instructions && <p style={{ ...font, fontSize: "0.83rem", color: "#374151", lineHeight: 1.7 }}>{instructions}</p>}
      {payment.provider === "peex" && (
        <p style={{ ...font, fontSize: "0.78rem", color: "#0B3D91", fontWeight: 600 }}>
          {timedOut
            ? "Nous n'avons pas encore reçu la confirmation. Si vous avez validé, le paiement sera pris en compte automatiquement."
            : "⏳ En attente de votre validation sur le téléphone…"}
        </p>
      )}
      {payment.provider === "peex" && (
        <p style={{ ...font, fontSize: "0.72rem", color: "#6b7280" }}>Référence : {payment.reference}</p>
      )}
    </div>
  );
}
