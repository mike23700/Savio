import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

export default function Bans() {
  const { t } = useLang();
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    fiance1Nom: "", fiance1Prenom: "", fiance1Age: "",
    fiance2Nom: "", fiance2Prenom: "", fiance2Age: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);
    try {
      await apiPost("/bans", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        fiance1_nom: form.fiance1Nom,
        fiance1_prenom: form.fiance1Prenom,
        fiance2_nom: form.fiance2Nom,
        fiance2_prenom: form.fiance2Prenom,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("celebrer.form.erreurGenerique"));
      if (err instanceof ApiError && err.errors) {
        setValidationErrors(Object.values(err.errors).flat());
      }
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  const docs = [
    t("celebrer.bans.doc1"),
    t("celebrer.bans.doc2"),
    t("celebrer.bans.doc3"),
    t("celebrer.bans.doc4"),
    t("celebrer.bans.doc5"),
    t("celebrer.bans.doc6"),
    t("celebrer.bans.doc7"),
    t("celebrer.bans.doc8"),
  ];

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=500&fit=crop&auto=format" alt={t("celebrer.bans.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("celebrer.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("celebrer.bans.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("celebrer.bans.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("celebrer.bans.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("celebrer.bans.surtitre")}</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>{t("celebrer.bans.definition")}</h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8 }}>
              {t("celebrer.bans.definitionTexte")}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 16 }}>{t("celebrer.bans.documentsTitre")}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map((doc) => (
                <div key={doc} className="flex items-start gap-2">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0B3D91", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", lineHeight: 1.6 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4"><Icon name="ring" size={48} /></div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>{t("celebrer.bans.envoyeeTitre")}</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                {t("celebrer.bans.envoyeeTexte")}
              </p>
              <button onClick={() => setSubmitted(false)}
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                {t("celebrer.bans.nouvelleDemande")}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>{t("celebrer.bans.formulaireTitre")}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>{t("celebrer.bans.contactPrincipal")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.nom")}</label>
                      <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder={t("celebrer.form.nomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.prenom")}</label>
                      <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder={t("celebrer.form.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.email")}</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t("celebrer.form.emailPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.telephone")}</label>
                      <input required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder={t("celebrer.form.telephonePlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>{t("celebrer.bans.fiance")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.nom")}</label>
                      <input required value={form.fiance1Nom} onChange={e => setForm({ ...form, fiance1Nom: e.target.value })} placeholder={t("celebrer.form.nomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.prenom")}</label>
                      <input required value={form.fiance1Prenom} onChange={e => setForm({ ...form, fiance1Prenom: e.target.value })} placeholder={t("celebrer.form.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.age")}</label>
                      <input required type="number" value={form.fiance1Age} onChange={e => setForm({ ...form, fiance1Age: e.target.value })} placeholder={t("celebrer.form.agePlaceholder")} className={inputClass} style={inputStyle} min="18" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>{t("celebrer.bans.fiancee")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.nom")}</label>
                      <input required value={form.fiance2Nom} onChange={e => setForm({ ...form, fiance2Nom: e.target.value })} placeholder={t("celebrer.form.nomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.prenom")}</label>
                      <input required value={form.fiance2Prenom} onChange={e => setForm({ ...form, fiance2Prenom: e.target.value })} placeholder={t("celebrer.form.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.age")}</label>
                      <input required type="number" value={form.fiance2Age} onChange={e => setForm({ ...form, fiance2Age: e.target.value })} placeholder={t("celebrer.form.agePlaceholder")} className={inputClass} style={inputStyle} min="18" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                    {error}
                    {validationErrors.length > 0 && (
                      <ul className="list-disc list-inside mt-1">
                        {validationErrors.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                  {t("celebrer.bans.soumettre")} <Icon name="ring" size={16} strokeWidth={1.75} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}