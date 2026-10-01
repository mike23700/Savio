import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

const GROUPES: { value: string; key: string }[] = [
  { value: "Conseil pastoral", key: "vie.registre.groupe.1" },
  { value: "Conseil des affaires économiques", key: "vie.registre.groupe.2" },
  { value: "Mouvements adultes", key: "vie.registre.groupe.3" },
  { value: "Mouvements jeunes", key: "vie.registre.groupe.4" },
  { value: "Groupes liturgiques", key: "vie.registre.groupe.5" },
  { value: "Communautés du Grand Nord", key: "vie.registre.groupe.6" },
  { value: "CHORALES", key: "vie.registre.groupe.7" },
];

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  trancheAge: string;
  rue: string;
  quartier: string;
  lieuDit: string;
  membreCEV: string;
  quelleCEV: string;
  membreGroupe: string;
  quelGroupe: string;
  anciennete: string;
}

export default function Registre() {
  const { t } = useLang();
  const [form, setForm] = useState<FormData>({
    nom: "", prenom: "", email: "", telephone: "",
    trancheAge: "", rue: "", quartier: "", lieuDit: "",
    membreCEV: "", quelleCEV: "", membreGroupe: "", quelGroupe: "", anciennete: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/registre", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        tranche_age: form.trancheAge,
        rue: form.rue || null,
        quartier: form.quartier,
        lieu_dit: form.lieuDit || null,
        membre_cev: form.membreCEV === "oui",
        quelle_cev: form.quelleCEV || null,
        membre_groupe: form.membreGroupe === "oui",
        quel_groupe: form.quelGroupe || null,
        anciennete: form.anciennete,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("vie.registre.erreur"));
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4"><Icon name="checkCircle" size={56} /></div>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>{t("vie.registre.merci")}</h2>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 8, lineHeight: 1.7 }}>
          {t("vie.registre.merciTexte")}
        </p>
        <Link to="/vie-paroissiale"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          <Icon name="arrowLeft" size={16} /> {t("vie.titre")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1400&h=500&fit=crop&auto=format" alt={t("vie.registre.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("vie.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("vie.registre.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("vie.registre.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("vie.registre.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("vie.registre.kicker")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("vie.registre.h2")}</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 32, lineHeight: 1.7 }}>
            {t("vie.registre.intro")}
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identité */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>{t("vie.registre.section.identite")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.nom")}</label>
                    <input required value={form.nom} onChange={set("nom")} placeholder={t("vie.registre.ph.nom")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.prenom")}</label>
                    <input required value={form.prenom} onChange={set("prenom")} placeholder={t("vie.registre.ph.prenom")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.email")}</label>
                    <input type="email" value={form.email} onChange={set("email")} placeholder="votre@email.com" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.telephone")}</label>
                    <input required value={form.telephone} onChange={set("telephone")} placeholder="(+237) 6XX XXX XXX" className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="mt-4">
                  <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.trancheAge")}</label>
                  <select required value={form.trancheAge} onChange={set("trancheAge")} className={inputClass} style={inputStyle}>
                    <option value="">{t("vie.registre.select.selectionner")}</option>
                    <option value="0-14">{t("vie.registre.age.a")}</option>
                    <option value="15-24">{t("vie.registre.age.b")}</option>
                    <option value="25-64">{t("vie.registre.age.c")}</option>
                    <option value="65+">{t("vie.registre.age.d")}</option>
                  </select>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>{t("vie.registre.section.adresse")}</h3>
                <div className="space-y-4">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.rue")}</label>
                    <input value={form.rue} onChange={set("rue")} placeholder={t("vie.registre.ph.rue")} className={inputClass} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.quartier")}</label>
                      <input required value={form.quartier} onChange={set("quartier")} placeholder={t("vie.registre.ph.quartier")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.lieuDit")}</label>
                      <input value={form.lieuDit} onChange={set("lieuDit")} placeholder={t("vie.registre.ph.lieuDit")} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CEV */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>{t("vie.registre.section.cev")}</h3>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.membreCev")}</label>
                  <select required value={form.membreCEV} onChange={set("membreCEV")} className={inputClass} style={inputStyle}>
                    <option value="">{t("vie.registre.select.selectionner")}</option>
                    <option value="oui">{t("vie.registre.oui")}</option>
                    <option value="non">{t("vie.registre.non")}</option>
                  </select>
                </div>
                {form.membreCEV === "oui" && (
                  <div className="mt-4">
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.quelleCev")}</label>
                    <input value={form.quelleCEV} onChange={set("quelleCEV")} placeholder={t("vie.registre.ph.cev")} className={inputClass} style={inputStyle} />
                  </div>
                )}
              </div>

              {/* Groupe */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>{t("vie.registre.section.groupe")}</h3>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.membreGroupe")}</label>
                  <select required value={form.membreGroupe} onChange={set("membreGroupe")} className={inputClass} style={inputStyle}>
                    <option value="">{t("vie.registre.select.selectionner")}</option>
                    <option value="oui">{t("vie.registre.oui")}</option>
                    <option value="non">{t("vie.registre.non")}</option>
                  </select>
                </div>
                {form.membreGroupe === "oui" && (
                  <div className="mt-4">
                    <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.quelGroupe")}</label>
                    <select value={form.quelGroupe} onChange={set("quelGroupe")} className={inputClass} style={inputStyle}>
                      <option value="">{t("vie.registre.select.selectionner")}</option>
                      {GROUPES.map(g => <option key={g.value} value={g.value}>{t(g.key)}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Ancienneté */}
              <div>
                <label style={labelStyle} className="block mb-1.5">{t("vie.registre.label.anciennete")}</label>
                <select required value={form.anciennete} onChange={set("anciennete")} className={inputClass} style={inputStyle}>
                  <option value="">{t("vie.registre.select.selectionner")}</option>
                  <option value="moins2">{t("vie.registre.anciennete.moins2")}</option>
                  <option value="2-5">{t("vie.registre.anciennete.deux5")}</option>
                  <option value="5-10">{t("vie.registre.anciennete.cinq10")}</option>
                  <option value="plus10">{t("vie.registre.anciennete.plus10")}</option>
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
                {t("vie.registre.submit")} <Icon name="cross" size={16} strokeWidth={1.75} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
