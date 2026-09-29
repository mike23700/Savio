import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { apiGet, apiPost, ApiError, localDateISO, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import PaymentStatus, { type PaymentInfo } from "@/components/PaymentStatus";
import { ESPACE_KIND, formatFcfa, formatShortDate, type Espace, type Reservation } from "@/lib/content-types";

const font = { fontFamily: "Montserrat, sans-serif" };
const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
const inputStyle = { ...font, fontSize: "0.85rem", color: "#1c2340" };
const labelStyle = { ...font, fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

const EVENT_TYPES = ["Mariage / réception", "Baptême / communion", "Anniversaire", "Deuil / veillée", "Conférence / séminaire", "Réunion", "Concert / spectacle", "Autre"];

interface Quote {
  duree: number;
  unites_restantes: number;
  disponible: boolean;
  montant: number | null;
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localDateISO(d);
}

export default function EspaceDetail({ kind }: { kind: Espace["kind"] }) {
  const { slug } = useParams();
  const { user } = useAuth();
  const meta = ESPACE_KIND[kind];
  const isRoom = kind === "chambre";
  const today = localDateISO();

  const [espace, setEspace] = useState<Espace | null | undefined>(undefined);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [form, setForm] = useState({
    date_debut: "", date_fin: "", nb_unites: 1, nb_personnes: "", evenement: "", nom: "", prenom: "", email: "", telephone: "", message: "",
    payment_method: "orange_money",
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reservation: Reservation; payment: PaymentInfo | null } | null>(null);

  useEffect(() => {
    setEspace(undefined);
    apiGet<Espace>(`/espaces/${slug}`).then(setEspace).catch(() => setEspace(null));
  }, [slug]);

  // Prefill the contact fields for signed-in parishioners.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, nom: f.nom || user.nom, prenom: f.prenom || user.prenom, email: f.email || user.email, telephone: f.telephone || user.phone || "" }));
  }, [user]);

  // Live availability + price for the chosen dates.
  useEffect(() => {
    setQuote(null);
    if (!espace || !form.date_debut || !form.date_fin) return;
    const timer = setTimeout(() => {
      apiGet<Quote>(`/espaces/${espace.slug}/disponibilite?debut=${form.date_debut}&fin=${form.date_fin}&unites=${form.nb_unites}`)
        .then(setQuote)
        .catch(() => setQuote(null));
    }, 250);
    return () => clearTimeout(timer);
  }, [espace, form.date_debut, form.date_fin, form.nb_unites]);

  const fullDays = useMemo(() => (espace?.jours_complets ?? []).slice(0, 12), [espace]);

  function setDebut(value: string) {
    setForm((f) => {
      let fin = f.date_fin;
      if (isRoom && (!fin || fin <= value)) fin = value ? addDays(value, 1) : "";
      if (!isRoom && (!fin || fin < value)) fin = value;
      return { ...f, date_debut: value, date_fin: fin };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!espace) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiPost<{ reservation: Reservation; payment: PaymentInfo | null }>("/reservations", {
        espace_id: espace.id,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        nb_unites: form.nb_unites,
        nb_personnes: form.nb_personnes ? Number(form.nb_personnes) : null,
        evenement: form.evenement || null,
        message: form.message || null,
        payment_method: espace.prix ? form.payment_method : null,
      });
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (espace === undefined) {
    return <div className="min-h-[50vh] flex items-center justify-center" style={{ ...font, color: "#9ca3af" }}>Chargement…</div>;
  }
  if (espace === null || espace.kind !== kind) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <p style={{ ...font, color: "#6b7280" }}>Cette {meta.item} est introuvable ou n'est plus proposée.</p>
        <Link to={meta.path} style={{ ...font, fontWeight: 700, color: "#0B3D91", marginTop: 12 }}>← {meta.title}</Link>
      </div>
    );
  }

  const photos = (espace.photos ?? []).map((p) => mediaUrl(p)).filter((p): p is string => !!p);
  const maxUnits = Math.max(1, quote ? quote.unites_restantes || espace.quantite : espace.quantite);

  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden bg-gray-200">
        {photos[photoIndex] && <img src={photos[photoIndex]} alt={espace.nom} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to={meta.path} style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{meta.title}</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ ...font, fontSize: "0.72rem", color: "#D4AF37" }}>{espace.nom}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{espace.nom}</h1>
          {espace.resume && <p style={{ ...font, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{espace.resume}</p>}
        </div>
      </div>

      <section className="py-12 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Description */}
          <div className="lg:col-span-3 space-y-6">
            {photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {photos.map((p, i) => (
                  <button key={p} onClick={() => setPhotoIndex(i)} aria-label={`Photo ${i + 1}`}
                    className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2" style={{ borderColor: i === photoIndex ? "#D4AF37" : "transparent" }}>
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <div style={{ ...font, fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>TARIF</div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#0B3D91" }}>
                    {espace.prix ? <>{formatFcfa(espace.prix)}<span style={{ ...font, fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}> / {meta.unit}</span></> : "Sur devis"}
                  </div>
                </div>
                {espace.capacite && (
                  <div>
                    <div style={{ ...font, fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>CAPACITÉ</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>
                      {espace.capacite} <span style={{ ...font, fontSize: "0.78rem", color: "#6b7280", fontWeight: 500 }}>personne{espace.capacite > 1 ? "s" : ""}{isRoom ? " / chambre" : ""}</span>
                    </div>
                  </div>
                )}
                {isRoom && espace.quantite > 1 && (
                  <div>
                    <div style={{ ...font, fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>CHAMBRES</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>{espace.quantite}</div>
                  </div>
                )}
              </div>
              {espace.description && (
                <p style={{ ...font, fontSize: "0.88rem", color: "#374151", lineHeight: 1.8, whiteSpace: "pre-line" }}>{espace.description}</p>
              )}
            </div>

            {espace.equipements && espace.equipements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>Équipements</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {espace.equipements.map((eq) => (
                    <li key={eq} style={{ ...font, fontSize: "0.84rem", color: "#374151" }}>✓ {eq}</li>
                  ))}
                </ul>
              </div>
            )}

            {fullDays.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>Dates déjà complètes</h2>
                <div className="flex flex-wrap gap-2">
                  {fullDays.map((d) => (
                    <span key={d} className="bg-red-50 text-red-700 rounded-full px-3 py-1" style={{ ...font, fontSize: "0.72rem", fontWeight: 600 }}>{formatShortDate(d)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:sticky lg:top-24">
              {result ? (
                <div className="text-center">
                  <div className="text-5xl mb-3">✅</div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", fontWeight: 700, color: "#1c2340" }}>
                    {result.payment ? "Réservation enregistrée" : "Demande envoyée"}
                  </h2>
                  <p style={{ ...font, fontSize: "0.8rem", color: "#6b7280", marginTop: 6 }}>Référence : <strong>{result.reservation.reference}</strong></p>
                  <p style={{ ...font, fontSize: "0.82rem", color: "#374151", marginTop: 8, lineHeight: 1.6 }}>
                    {espace.nom} · {isRoom ? "du" : "le"} {formatShortDate(result.reservation.date_debut)}
                    {(isRoom || result.reservation.date_fin !== result.reservation.date_debut) && <> {isRoom ? "au" : "→"} {formatShortDate(result.reservation.date_fin)}</>}
                  </p>
                  {result.reservation.montant && (
                    <p style={{ ...font, fontSize: "0.85rem", color: "#374151", marginTop: 4 }}>Montant : <strong>{formatFcfa(result.reservation.montant)}</strong></p>
                  )}
                  <div className="mt-5">
                    {result.payment ? (
                      <PaymentStatus initial={result.payment} />
                    ) : (
                      <p className="bg-blue-50 rounded-xl p-4 text-left" style={{ ...font, fontSize: "0.83rem", color: "#374151", lineHeight: 1.7 }}>
                        Le secrétariat paroissial vous recontactera au {result.reservation.telephone} avec un devis pour confirmer la réservation.
                      </p>
                    )}
                  </div>
                  <Link to={meta.path} style={{ ...font, fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }} className="inline-block mt-5 hover:underline">
                    ← Retour : {meta.title.toLowerCase()}
                  </Link>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>
                    {espace.prix ? "Réserver" : "Demander un devis"}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{isRoom ? "Arrivée *" : "Du *"}</label>
                      <input required type="date" min={today} value={form.date_debut} onChange={(e) => setDebut(e.target.value)} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{isRoom ? "Départ *" : "Au (inclus) *"}</label>
                      <input required type="date" min={form.date_debut ? (isRoom ? addDays(form.date_debut, 1) : form.date_debut) : today}
                        value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} className={inputClass} style={inputStyle} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {isRoom && espace.quantite > 1 && (
                      <div>
                        <label style={labelStyle} className="block mb-1.5">Chambres</label>
                        <select value={form.nb_unites} onChange={(e) => setForm({ ...form, nb_unites: Number(e.target.value) })} className={inputClass} style={inputStyle}>
                          {Array.from({ length: Math.max(maxUnits, form.nb_unites) }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    )}
                    <div className={isRoom && espace.quantite > 1 ? "" : "col-span-2"}>
                      <label style={labelStyle} className="block mb-1.5">{isRoom ? "Personnes" : "Nombre d'invités"}</label>
                      <input type="number" min={1} max={espace.capacite ? espace.capacite * form.nb_unites : undefined} value={form.nb_personnes}
                        onChange={(e) => setForm({ ...form, nb_personnes: e.target.value })} className={inputClass} style={inputStyle} />
                    </div>
                  </div>

                  {!isRoom && (
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Type d'événement *</label>
                      <select required value={form.evenement} onChange={(e) => setForm({ ...form, evenement: e.target.value })} className={inputClass} style={inputStyle}>
                        <option value="">Choisir…</option>
                        {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}

                  {quote && (
                    <div className={`rounded-xl px-4 py-3 ${quote.disponible ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                      {quote.disponible ? (
                        <div style={{ ...font, fontSize: "0.82rem", color: "#166534" }}>
                          <strong>Disponible</strong> · {quote.duree} {quote.duree > 1 ? meta.units : meta.unit}
                          {quote.montant !== null && <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: 2 }}>Total : {formatFcfa(quote.montant)}</div>}
                        </div>
                      ) : (
                        <p style={{ ...font, fontSize: "0.82rem", color: "#991b1b" }}>
                          {quote.duree < 1
                            ? "Vérifiez les dates choisies."
                            : quote.unites_restantes > 0
                              ? `Il ne reste que ${quote.unites_restantes} ${meta.item}(s) disponible(s) sur ces dates.`
                              : "Ces dates ne sont pas disponibles. Merci d'en choisir d'autres."}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Nom *" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className={inputClass} style={inputStyle} />
                    <input required placeholder="Prénom(s) *" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                  <input required type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder={espace.prix && form.payment_method !== "especes" ? "Numéro Mobile Money à débiter *" : "Téléphone *"} className={inputClass} style={inputStyle} />
                  <input type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} style={inputStyle} />
                  <textarea rows={3} placeholder={isRoom ? "Précisions (heure d'arrivée, besoins particuliers…)" : "Précisions (horaires, besoins : sonorisation, chaises, ménage…)"}
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} style={{ ...inputStyle, resize: "vertical" as const }} />

                  {espace.prix ? (
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Mode de paiement</label>
                      <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className={inputClass} style={inputStyle}>
                        <option value="orange_money">Orange Money</option>
                        <option value="mtn_momo">MTN MoMo</option>
                        <option value="especes">Espèces (au secrétariat)</option>
                      </select>
                    </div>
                  ) : (
                    <p style={{ ...font, fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.6 }}>
                      Le tarif de cet espace dépend de l'événement : le secrétariat vous enverra un devis après réception de votre demande.
                    </p>
                  )}

                  {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ ...font, fontSize: "0.82rem" }}>{error}</div>}

                  <button type="submit" disabled={submitting || (quote !== null && !quote.disponible)}
                    style={{ background: "#0B3D91", ...font, fontWeight: 700, fontSize: "0.85rem" }}
                    className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                    {submitting ? "Envoi…" : espace.prix ? `Réserver et payer${quote?.montant ? ` ${formatFcfa(quote.montant)}` : ""}` : "Envoyer ma demande"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
