import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";
import { apiGet, apiPost, ApiError, mediaUrl } from "@/lib/api";
import { type Reservation } from "@/lib/content-types";
import { type RegistreInscription, type RegistrePrintRequest, SACREMENT_LABELS, formatIsoDate } from "@/lib/sacrements";
import { useLang } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/Icon";

type Mode = "login" | "register";
type Tab = "profil" | "registre" | "journal" | "homelies" | "achats" | "reservations" | "donations";

interface Homelie {
  id: number;
  title: string;
  img: string;
  readings: string;
  duration: string;
  published_at: string;
}

interface JournalTarif {
  id: number;
  label: string;
  price_label: string;
  period: string;
}

interface JournalIssue {
  id: number;
  numero: string;
  theme: string;
  published_at: string;
}

interface JournalSubscription {
  id: number;
  status: "active" | "inactive";
  format: string;
  tarif: JournalTarif | null;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items: { product_nom_snapshot: string; qty: number }[];
}

interface DonationRow {
  id: number;
  montant: number;
  payment_status: string;
  intention: string | null;
  projet: { id: number; titre: string } | null;
  created_at: string;
}

export default function EspaceMembre() {
  const { t, lang } = useLang();
  const { user, loading, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Set by RequireAuth: bring the visitor back where they were going (e.g. /don?projet=3)
  const redirectFrom = (location.state as { from?: { pathname: string; search: string } } | null)?.from;
  const [mode, setMode] = useState<Mode>("login");
  const [tab, setTab] = useState<Tab>("profil");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ nom: "", prenom: "", email: "", phone: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<Homelie[]>([]);
  const [subscription, setSubscription] = useState<JournalSubscription | null>(null);
  const [tarifs, setTarifs] = useState<JournalTarif[]>([]);
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [subscribeTarifId, setSubscribeTarifId] = useState("");
  const [subscribeFormat, setSubscribeFormat] = useState("electronique");

  const [registre, setRegistre] = useState<RegistreInscription | null>(null);
  const [registreLoaded, setRegistreLoaded] = useState(false);
  const [printRequests, setPrintRequests] = useState<RegistrePrintRequest[]>([]);
  const [printMessage, setPrintMessage] = useState("");
  const [printSubmitting, setPrintSubmitting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [printSuccess, setPrintSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (tab === "homelies") apiGet<Homelie[]>("/favorites").then(setFavorites).catch(() => {});
    if (tab === "journal") {
      apiGet<JournalSubscription | null>("/journal/my-subscription").then(setSubscription).catch(() => {});
      apiGet<JournalTarif[]>("/journal/tarifs").then(setTarifs).catch(() => {});
      apiGet<JournalIssue[]>("/journal/issues").then(setIssues).catch(() => {});
    }
    if (tab === "achats") apiGet<Order[]>("/my-orders").then(setOrders).catch(() => {});
    if (tab === "donations") apiGet<DonationRow[]>("/my-donations").then(setDonations).catch(() => {});
    if (tab === "reservations") apiGet<Reservation[]>("/my-reservations").then(setReservations).catch(() => {});
    if (tab === "registre") {
      setRegistreLoaded(false);
      apiGet<RegistreInscription | null>("/my-registre")
        .then(setRegistre)
        .catch(() => setRegistre(null))
        .finally(() => setRegistreLoaded(true));
      apiGet<RegistrePrintRequest[]>("/my-registre-demandes").then(setPrintRequests).catch(() => {});
    }
  }, [tab, user]);

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  const tabs: { id: Tab; label: string; icon: IconName }[] = [
    { id: "profil", label: t("top.membre.ongletProfil"), icon: "user" },
    { id: "registre", label: t("top.membre.ongletRegistre"), icon: "clipboard" },
    { id: "journal", label: t("top.membre.ongletJournal"), icon: "newspaper" },
    { id: "homelies", label: t("top.membre.ongletHomelies"), icon: "mic" },
    { id: "achats", label: t("top.membre.ongletAchats"), icon: "cart" },
    { id: "reservations", label: t("top.membre.ongletReservations"), icon: "bed" },
    { id: "donations", label: t("top.membre.ongletDonations"), icon: "heart" },
  ];

  const statutLabel = (s: Reservation["statut"]): string =>
    s === "confirmee" ? t("top.membre.statutConfirmee")
    : s === "annulee" ? t("top.membre.statutAnnulee")
    : s === "terminee" ? t("top.membre.statutTerminee")
    : t("top.membre.statutEnAttente");

  const locale = lang === "en" ? "en-GB" : "fr-FR";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    try {
      await login(loginForm.email, loginForm.password);
      if (redirectFrom) navigate(redirectFrom.pathname + redirectFrom.search, { replace: true });
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : t("top.membre.erreurConnexion"));
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    if (registerForm.password !== registerForm.confirm) {
      setAuthError(t("top.membre.motsDePasseDifferents"));
      return;
    }
    try {
      await register({
        nom: registerForm.nom,
        prenom: registerForm.prenom,
        email: registerForm.email,
        phone: registerForm.phone || undefined,
        password: registerForm.password,
        password_confirmation: registerForm.confirm,
      });
      if (redirectFrom) navigate(redirectFrom.pathname + redirectFrom.search, { replace: true });
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : t("top.membre.erreurInscription"));
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subscribeTarifId) return;
    const sub = await apiPost<JournalSubscription>("/journal/subscribe", { tarif_id: subscribeTarifId, format: subscribeFormat });
    setSubscription(sub);
  }

  async function handleRequestPrint(e: React.FormEvent) {
    e.preventDefault();
    setPrintError(null);
    setPrintSuccess(false);
    setPrintSubmitting(true);
    try {
      const created = await apiPost<RegistrePrintRequest>("/registre/demandes-impression", { message: printMessage || null });
      setPrintRequests(prev => [created, ...prev]);
      setPrintMessage("");
      setPrintSuccess(true);
    } catch (err) {
      setPrintError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setPrintSubmitting(false);
    }
  }

  const printStatutColor: Record<string, { bg: string; fg: string }> = {
    en_attente: { bg: "#fef3c7", fg: "#92400e" },
    en_traitement: { bg: "#dbeafe", fg: "#1e40af" },
    prete: { bg: "#dcfce7", fg: "#15803d" },
    livree: { bg: "#e0e7ff", fg: "#3730a3" },
    refusee: { bg: "#fee2e2", fg: "#b91c1c" },
  };
  const openPrintRequest = printRequests.some(r => ["en_attente", "en_traitement", "prete"].includes(r.statut));

  if (loading) return null;

  if (user) {
    return (
      <>
        <div className="relative h-48 md:h-56 flex items-end overflow-hidden">
          <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=400&fit=crop&auto=format" alt={t("top.membre.alt")} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 py-8 w-full flex items-end justify-between">
            <div>
              <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>{t("top.membre.titre")}</h1>
              <p style={{ fontFamily: "Montserrat, sans-serif", color: "#D4AF37", fontSize: "0.85rem", marginTop: 4, fontWeight: 700 }}>
                {t("top.membre.bienvenue").replace("{nom}", `${user.prenom} ${user.nom}`)}
              </p>
            </div>
            <button onClick={async () => { await logout(); navigate("/"); }}
              style={{ border: "2px solid white", color: "white", fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}
              className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              {t("top.membre.deconnexion")}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, background: tab === t.id ? "#0B3D91" : "white", color: tab === t.id ? "white" : "#374151", border: tab === t.id ? "1px solid #0B3D91" : "1px solid #e5e7eb" }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:opacity-90 transition-all">
                <Icon name={t.icon} size={16} strokeWidth={1.75} /> {t.label}
              </button>
            ))}
          </div>

          {tab === "profil" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("top.membre.ongletProfil")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  [t("top.membre.champNom"), user.nom],
                  [t("top.membre.champPrenom"), user.prenom],
                  [t("top.membre.champEmail"), user.email],
                  [t("top.membre.champTelephone"), user.phone || "—"],
                  [t("top.membre.champParoisse"), "Saint Dominique Savio"],
                  [t("top.membre.champDoyenne"), "Wouri I"],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#F5F7FA", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.05em" }}>{(label as string).toUpperCase()}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1c2340", marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "registre" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("top.membre.ongletRegistre")}</h2>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginBottom: 24, lineHeight: 1.7 }}>{t("top.membre.registre.intro")}</p>

              {!registreLoaded ? (
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>{t("top.membre.registre.chargement")}</p>
              ) : !registre ? (
                <div style={{ background: "#F5F7FA", borderRadius: 12, padding: 20 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#374151", marginBottom: 12 }}>{t("top.membre.registre.aucuneTexte")}</p>
                  <Link to="/vie-paroissiale/registre"
                    style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.82rem" }}
                    className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <Icon name="clipboard" size={16} strokeWidth={1.75} /> {t("top.membre.registre.lienInscription")}
                  </Link>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>{t("top.membre.ongletRegistre")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {([
                      [t("top.membre.champNom"), registre.nom],
                      [t("top.membre.champPrenom"), registre.prenom],
                      [t("top.membre.champTelephone"), registre.telephone],
                      [t("top.membre.champEmail"), registre.email || "—"],
                      ["Quartier", registre.quartier || "—"],
                      ["Rue / Lieu-dit", [registre.rue, registre.lieu_dit].filter(Boolean).join(" · ") || "—"],
                      ["Tranche d'âge", registre.tranche_age || "—"],
                      ["Ancienneté", registre.anciennete || "—"],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} style={{ background: "#F5F7FA", borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.05em" }}>{label.toUpperCase()}</div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1c2340", marginTop: 4 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>{t("top.membre.registre.sacrements")}</h3>
                  {registre.sacrements.length === 0 ? (
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af", marginBottom: 24 }}>{t("top.membre.registre.aucunSacrement")}</p>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {registre.sacrements.map((s) => (
                        <div key={s.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", marginBottom: 6 }}>
                            {SACREMENT_LABELS[s.type]}
                            {s.numero_registre ? <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#6b7280", fontWeight: 400 }}> · N° {s.numero_registre}</span> : null}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "4px 16px", fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#374151" }}>
                            {s.date_evenement && <div><span style={{ color: "#9ca3af" }}>Date : </span>{formatIsoDate(s.date_evenement)}</div>}
                            {s.lieu && <div><span style={{ color: "#9ca3af" }}>Lieu : </span>{s.lieu}</div>}
                            {s.parrain_marraine && <div><span style={{ color: "#9ca3af" }}>Parrain / Marraine : </span>{s.parrain_marraine}</div>}
                            {s.ministre && <div><span style={{ color: "#9ca3af" }}>Ministre : </span>{s.ministre}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("top.membre.registre.demander")}</h3>

                    {printSuccess && (
                      <div style={{ background: "#dcfce7", color: "#15803d", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                        {t("top.membre.registre.demandeEnvoyee")}
                      </div>
                    )}

                    {openPrintRequest ? (
                      <div style={{ background: "#fef3c7", color: "#92400e", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                        Une demande d'impression est déjà en cours pour votre fiche.
                      </div>
                    ) : (
                      <form onSubmit={handleRequestPrint} style={{ background: "#F5F7FA", borderRadius: 12, padding: 20 }}>
                        <label style={labelStyle} className="block mb-1.5">{t("top.membre.registre.messageLabel")}</label>
                        <textarea rows={3} value={printMessage} onChange={e => setPrintMessage(e.target.value)} placeholder={t("top.membre.registre.messagePlaceholder")} className={inputClass} style={inputStyle} />
                        {printError && (
                          <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", marginTop: 12, fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem" }}>{printError}</div>
                        )}
                        <button type="submit" disabled={printSubmitting}
                          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.82rem", opacity: printSubmitting ? 0.6 : 1 }}
                          className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity mt-4">
                          <Icon name="fileText" size={16} strokeWidth={1.75} /> {t("top.membre.registre.demander")}
                        </button>
                      </form>
                    )}

                    <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", margin: "24px 0 12px" }}>{t("top.membre.registre.demandesTitre")}</h4>
                    {printRequests.length === 0 ? (
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>{t("top.membre.registre.aucuneDemande")}</p>
                    ) : (
                      <div className="space-y-3">
                        {printRequests.map((r) => {
                          const color = printStatutColor[r.statut] ?? { bg: "#f3f4f6", fg: "#6b7280" };
                          return (
                            <div key={r.id} className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-100">
                              <div>
                                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37" }}>{r.reference}</div>
                                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280" }}>{new Date(r.created_at).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</div>
                                {r.message && <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#374151", marginTop: 4 }}>{r.message}</div>}
                                {r.admin_notes && <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280", marginTop: 4 }}><span style={{ color: "#9ca3af" }}>Note du secrétariat : </span>{r.admin_notes}</div>}
                              </div>
                              <span style={{ background: color.bg, color: color.fg, borderRadius: 20, padding: "3px 10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                                {t(`top.membre.registre.statut.${r.statut}`)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "journal" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("top.membre.ongletJournal")}</h2>

              {subscription ? (
                <div style={{ background: "#E8F2FF", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280" }}>{t("top.membre.abonnement")}</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#0B3D91" }}>
                      {subscription.tarif?.label || "—"} – {subscription.format === "electronique" ? t("top.membre.formatElectronique") : t("top.membre.formatPapier")}
                    </div>
                  </div>
                  <span style={{ background: subscription.status === "active" ? "#27ae60" : "#9ca3af", color: "white", borderRadius: 20, padding: "4px 12px", fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700 }}>
                    {subscription.status === "active" ? t("top.membre.actif") : t("top.membre.inactif")}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ background: "#F5F7FA", borderRadius: 12, padding: 20, marginBottom: 24 }}>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#374151", marginBottom: 12 }}>{t("top.membre.pasAbonnement")}</p>
                  <div className="flex flex-wrap gap-3">
                    <select value={subscribeTarifId} onChange={e => setSubscribeTarifId(e.target.value)} className={inputClass} style={{ ...inputStyle, maxWidth: 220 }}>
                      <option value="">{t("top.membre.choisirFormule")}</option>
                      {tarifs.map(t => <option key={t.id} value={t.id}>{t.label} – {t.price_label}</option>)}
                    </select>
                    <select value={subscribeFormat} onChange={e => setSubscribeFormat(e.target.value)} className={inputClass} style={{ ...inputStyle, maxWidth: 180 }}>
                      <option value="electronique">{t("top.membre.formatElectronique")}</option>
                      <option value="papier">{t("top.membre.formatPapier")}</option>
                    </select>
                    <button type="submit" style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.82rem" }} className="text-white px-5 py-2.5 rounded-xl hover:opacity-90">
                      {t("top.membre.sAbonner")}
                    </button>
                  </div>
                </form>
              )}

              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>{t("top.membre.derniersNumeros")}</h3>
              {issues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 600, color: "#1c2340" }}>
                      {issue.numero} – {new Date(issue.published_at).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                    </div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280" }}>{issue.theme}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "homelies" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("top.membre.ongletHomelies")}</h2>
              {favorites.length === 0 && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>{t("top.membre.aucuneHomelie")}</p>}
              <div className="space-y-4">
                {favorites.map((h) => (
                  <div key={h.id} className="flex gap-4 items-start p-4 rounded-xl border border-gray-100 hover:border-yellow-200 transition-all">
                    <img src={mediaUrl(h.img) ?? undefined} alt={h.title} className="w-20 h-14 object-cover rounded-lg" />
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em" }}>
                        {new Date(h.published_at).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", marginBottom: 4, lineHeight: 1.3 }}>{h.title}</h3>
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280" }}>{h.readings} · {h.duration}</p>
                      <Link to="/homelies" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#0B3D91", fontWeight: 700 }}>{t("top.membre.ecouter")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "achats" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("top.membre.ongletAchats")}</h2>
              {orders.length === 0 && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>{t("top.membre.aucunAchat")}</p>}
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-gray-100 hover:border-yellow-200 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37" }}>{order.order_number}</div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#1c2340", marginTop: 2 }}>
                          {order.items.map(i => `${i.product_nom_snapshot} x${i.qty}`).join(", ")}
                        </div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280" }}>{new Date(order.created_at).toLocaleDateString(locale)}</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#0B3D91" }}>{order.total.toLocaleString(locale)} FCFA</div>
                        <span style={{ background: order.payment_status === "paye" ? "#dcfce7" : "#fef3c7", color: order.payment_status === "paye" ? "#15803d" : "#92400e", borderRadius: 20, padding: "2px 8px", fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem", fontWeight: 700 }}>
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "reservations" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("top.membre.ongletReservations")}</h2>
              {reservations.length === 0 && (
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>
                  {t("top.membre.aucuneReservationAvant")}<Link to="/centre-accueil" className="underline">{t("top.membre.centreAccueil")}</Link>{t("top.membre.aucuneReservationMilieu")}<Link to="/location-salles" className="underline">{t("top.membre.salles")}</Link>.
                </p>
              )}
              <div className="space-y-3">
                {reservations.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-gray-100 hover:border-yellow-200 transition-all">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37" }}>{r.reference}</div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#1c2340", marginTop: 2 }}>{r.espace?.nom}</div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280" }} className="flex items-center gap-1">
                          {new Date(`${r.date_debut.slice(0, 10)}T12:00:00`).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                          {r.date_fin.slice(0, 10) !== r.date_debut.slice(0, 10) && (
                            <>
                              <Icon name="arrowRight" size={14} strokeWidth={1.75} />
                              {new Date(`${r.date_fin.slice(0, 10)}T12:00:00`).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#0B3D91" }}>{r.montant ? `${r.montant.toLocaleString(locale)} FCFA` : t("top.common.surDevis")}</div>
                        <span style={{ background: r.statut === "confirmee" ? "#dcfce7" : r.statut === "annulee" ? "#f3f4f6" : "#fef3c7", color: r.statut === "confirmee" ? "#15803d" : r.statut === "annulee" ? "#6b7280" : "#92400e", borderRadius: 20, padding: "2px 8px", fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem", fontWeight: 700 }}>
                          {statutLabel(r.statut)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "donations" && (
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("top.membre.ongletDonations")}</h2>
              {donations.length === 0 && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#9ca3af", marginBottom: 20 }}>{t("top.membre.aucunDon")}</p>}
              <div className="space-y-3 mb-6">
                {donations.map((don) => (
                  <div key={don.id} className="p-4 rounded-xl border border-gray-100 hover:border-yellow-200 transition-all flex items-center justify-between">
                    <div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#1c2340" }}>{don.projet ? t("top.membre.projet").replace("{titre}", don.projet.titre) : don.intention || t("top.membre.donLibre")}</div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280" }}>{new Date(don.created_at).toLocaleDateString(locale)} · {don.payment_status}</div>
                    </div>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#0B3D91" }}>{don.montant.toLocaleString(locale)} FCFA</span>
                  </div>
                ))}
              </div>
              <Link to="/don"
                style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                <Icon name="heart" size={18} strokeWidth={1.75} /> {t("top.membre.nouveauDon")}
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format" alt={t("top.membre.alt")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.common.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("top.membre.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("top.membre.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("top.membre.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full">
            {(["login", "register"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setAuthError(null); }}
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", fontWeight: 700, background: mode === m ? "white" : "transparent", color: mode === m ? "#0B3D91" : "#6b7280", boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}
                className="flex-1 py-2.5 rounded-full transition-all">
                {m === "login" ? t("top.membre.connexion") : t("top.membre.inscription")}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                {authError}
              </div>
            )}
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.emailLabel")}</label>
                  <input required type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder={t("top.membre.emailPlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.motDePasse")}</label>
                  <input required type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder={t("top.membre.motDePassePlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                  {t("top.membre.seConnecter")}<Icon name="arrowRight" size={16} strokeWidth={1.75} />
                </button>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", textAlign: "center" }}>
                  {t("top.membre.pasEncoreMembre")}{" "}
                  <button type="button" onClick={() => setMode("register")} style={{ color: "#0B3D91", fontWeight: 700 }}>{t("top.membre.sInscrire")}</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("top.membre.nomLabel")}</label>
                    <input required value={registerForm.nom} onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} placeholder={t("top.membre.nomPlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("top.membre.prenomLabel")}</label>
                    <input required value={registerForm.prenom} onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} placeholder={t("top.membre.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.emailLabel")}</label>
                  <input required type="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} placeholder={t("top.membre.emailPlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.telephoneLabel")}</label>
                  <input value={registerForm.phone} onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })} placeholder={t("top.membre.telephonePlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.motDePasse")}</label>
                  <input required type="password" minLength={8} value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} placeholder={t("top.membre.motDePassePlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("top.membre.confirmation")}</label>
                  <input required type="password" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} placeholder={t("top.membre.motDePassePlaceholder")} className={inputClass} style={inputStyle} />
                </div>
                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                  {t("top.membre.creerCompte")}<Icon name="arrowRight" size={16} strokeWidth={1.75} />
                </button>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", textAlign: "center" }}>
                  {t("top.membre.dejaMembre")}{" "}
                  <button type="button" onClick={() => setMode("login")} style={{ color: "#0B3D91", fontWeight: 700 }}>{t("top.membre.seConnecter")}</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
