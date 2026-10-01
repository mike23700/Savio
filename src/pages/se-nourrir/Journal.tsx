import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Icon, { type IconName } from "@/components/Icon";
import { useLang } from "@/lib/i18n";

interface Tarif {
  id: number;
  label: string;
  price_label: string;
  issues: number;
  period: string;
}

export default function Journal() {
  const { t } = useLang();
  const { user } = useAuth();
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [tarifId, setTarifId] = useState("");
  const [format, setFormat] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Tarif[]>("/journal/tarifs").then(setTarifs).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/journal/subscribe", { tarif_id: tarifId, format });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("nourrir.form.erreurGenerique"));
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  const PROGRAMME: { icon: IconName; label: string }[] = [
    { icon: "bookOpen", label: t("nourrir.journal.programme.1") },
    { icon: "megaphone", label: t("nourrir.journal.programme.2") },
    { icon: "coins", label: t("nourrir.journal.programme.3") },
    { icon: "calendar", label: t("nourrir.journal.programme.4") },
  ];

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format" alt={t("nourrir.journal.nom")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/se-nourrir" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nourrir.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("nourrir.journal.nom")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("nourrir.journal.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("nourrir.journal.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("nourrir.journal.surtitre")}</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>{t("nourrir.journal.titre")}</h2>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.85 }}>
                {t("nourrir.journal.intro")}
              </p>
              <div className="mt-6 space-y-3">
                {PROGRAMME.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon name={item.icon} size={20} />
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#4b5563" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-4">{t("nourrir.journal.tarifsSurtitre")}</div>
              <div className="space-y-3">
                {tarifs.map((tarif, i) => (
                  <div key={tarif.id} className={`rounded-xl p-5 border ${i === tarifs.length - 1 ? "border-yellow-400 bg-yellow-50" : "border-gray-100 bg-white"} flex items-center justify-between`}>
                    <div>
                      <div style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "1rem" }}>{tarif.label}</div>
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>{t("nourrir.journal.tarifDetails").replace("{issues}", String(tarif.issues)).replace("{period}", tarif.period)}</div>
                    </div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, color: i === tarifs.length - 1 ? "#D4AF37" : "#0B3D91" }}>{tarif.price_label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#374151" }}>
                  <Icon name="smartphone" size={16} strokeWidth={1.75} /> {t("nourrir.journal.formatAvant")} <strong>{t("nourrir.journal.formatElectronique")}</strong> {t("nourrir.journal.formatMilieu")} <strong>{t("nourrir.journal.formatPapier")}</strong> {t("nourrir.journal.formatApres")}
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="max-w-xl mx-auto">
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("nourrir.journal.abonnerTitre")}</h3>
            {!user ? (
              <div className="text-center py-10 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-5xl mb-4"><Icon name="lock" size={48} /></div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340" }}>{t("nourrir.journal.connexionTitre")}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                  {t("nourrir.journal.connexionTexte")}
                </p>
                <Link to="/espace-paroissien"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                  {t("nourrir.journal.seConnecter")}<Icon name="arrowRight" size={16} />
                </Link>
              </div>
            ) : submitted ? (
              <div className="text-center py-10 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-5xl mb-4"><Icon name="newspaper" size={48} /></div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>{t("nourrir.journal.succesTitre")}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                  {t("nourrir.journal.succesTexte")}
                </p>
                <Link to="/espace-paroissien"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                  {t("nourrir.journal.voirEspace")}<Icon name="arrowRight" size={16} />
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("nourrir.journal.formule")}</label>
                    <select required value={tarifId} onChange={e => setTarifId(e.target.value)} className={inputClass} style={inputStyle}>
                      <option value="">{t("nourrir.form.selectionner")}</option>
                      {tarifs.map(t => <option key={t.id} value={t.id}>{t.label} – {t.price_label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("nourrir.journal.format")}</label>
                    <select required value={format} onChange={e => setFormat(e.target.value)} className={inputClass} style={inputStyle}>
                      <option value="">{t("nourrir.form.selectionner")}</option>
                      <option value="electronique">{t("nourrir.journal.optionElectronique")}</option>
                      <option value="papier">{t("nourrir.journal.optionPapier")}</option>
                    </select>
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                      {error}
                    </div>
                  )}
                  <button type="submit"
                    style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                    className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                    {t("nourrir.journal.envoyer")} <Icon name="newspaper" size={16} strokeWidth={1.75} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
