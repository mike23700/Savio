import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

interface Niveau {
  id: number;
  nom: string;
  age_label: string;
  icon: string;
  description: string;
  duree: string;
}

export default function Catechese() {
  const { t } = useLang();
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", niveau_id: "", age: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Niveau[]>("/catechese/niveaux").then(setNiveaux).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/catechese/inscriptions", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        niveau_id: form.niveau_id || null,
        age: form.age,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("nourrir.form.erreurGenerique"));
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1400&h=500&fit=crop&auto=format" alt={t("nourrir.catechese.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/se-nourrir" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nourrir.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("nourrir.catechese.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("nourrir.catechese.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("nourrir.catechese.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("nourrir.catechese.surtitre")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("nourrir.catechese.niveauxTitre")}</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 32, lineHeight: 1.7 }}>
            {t("nourrir.catechese.niveauxIntro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {niveaux.map((niveau) => (
              <div key={niveau.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all">
                <span style={{ fontSize: "2rem", display: "block", marginBottom: 12 }}>{niveau.icon}</span>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 4 }}>{niveau.age_label?.toUpperCase()}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{niveau.nom}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>{niveau.description}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#0B3D91", background: "#E8F2FF", padding: "2px 10px", borderRadius: 20 }}>
                  {t("nourrir.catechese.duree").replace("{duree}", niveau.duree)}
                </span>
              </div>
            ))}
          </div>

          {/* Inscription */}
          <div className="max-w-2xl mx-auto">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("nourrir.catechese.inscriptionSurtitre")}</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("nourrir.catechese.inscriptionsOuvertes")}</h2>

            {submitted ? (
              <div className="text-center py-10 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-5xl mb-4"><Icon name="checkCircle" size={48} /></div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>{t("nourrir.catechese.succesTitre")}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                  {t("nourrir.catechese.succesTexte")}
                </p>
                <button onClick={() => setSubmitted(false)}
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                  {t("nourrir.catechese.nouvelleInscription")}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.nom")}</label>
                      <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder={t("nourrir.catechese.nomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.prenom")}</label>
                      <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder={t("nourrir.catechese.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.email")}</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t("nourrir.catechese.emailPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.telephone")}</label>
                      <input required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder={t("nourrir.catechese.telephonePlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.age")}</label>
                    <input required value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder={t("nourrir.catechese.agePlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("nourrir.catechese.niveau")}</label>
                    <select required value={form.niveau_id} onChange={e => setForm({ ...form, niveau_id: e.target.value })} className={inputClass} style={inputStyle}>
                      <option value="">{t("nourrir.catechese.selectionnerNiveau")}</option>
                      {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom} ({n.age_label})</option>)}
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
                    {t("nourrir.catechese.envoyer")} <Icon name="cross" size={16} strokeWidth={1.75} />
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
