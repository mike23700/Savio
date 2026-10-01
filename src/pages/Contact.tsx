import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";
import { PARISH } from "@/data/content";
import { useLang } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/Icon";

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", sujet: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/contact", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone || null,
        sujet: form.sujet,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("top.common.erreurGenerique"));
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#374151" };
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format"
          alt={t("top.contact.alt")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.common.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("top.contact.breadcrumb")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("top.contact.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            {t("top.contact.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info column */}
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">
              {t("top.contact.surtitreInfos")}
            </div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>
              {t("top.contact.titreInfos")}
            </h2>

            <div className="space-y-5">
              {[
                { icon: "mapPin", title: t("top.contact.adresse"), content: PARISH.address },
                { icon: "phone", title: t("top.contact.telephone"), content: PARISH.phone, href: `tel:+237655529999` },
                { icon: "mail", title: t("top.contact.email"), content: PARISH.email, href: `mailto:${PARISH.email}` },
                { icon: "clock", title: t("top.contact.horaires"), content: PARISH.hours },
              ].map(({ icon, title, content, href }) => (
                <div key={title} className="flex gap-4">
                  <div style={{ width: 42, height: 42, background: "#E8F2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    <Icon name={icon as IconName} size={20} style={{ color: "#0B3D91" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{title}</div>
                    {href ? (
                      <a href={href} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#0B3D91", lineHeight: 1.6 }} className="hover:underline">{content}</a>
                    ) : (
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                {t("top.contact.reseaux")}
              </div>
              <div className="flex gap-3">
                {([["whatsapp", "WhatsApp", `https://wa.me/237655529999`], ["facebook", "Facebook", "#"], ["youtube", "YouTube", "#"], ["instagram", "Instagram", "#"]] as [IconName, string, string][]).map(([icon, name, href]) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer"
                    style={{ width: 40, height: 40, background: "#0B3D91", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}
                    className="hover:opacity-80 transition-opacity" title={name} aria-label={name}>
                    <Icon name={icon} size={18} strokeWidth={1.75} style={{ color: "white" }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8">
              <a href={PARISH.mapsUrl} target="_blank" rel="noreferrer"
                className="relative block rounded-2xl overflow-hidden h-40 group">
                <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=400&h=200&fit=crop&auto=format"
                  alt={t("top.contact.altLocalisation")} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "rgba(8,45,107,0.6)" }} />
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                  <Icon name="mapPin" size={30} style={{ color: "white" }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{t("top.contact.voirMaps")}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="h-full flex items-center justify-center flex-col text-center py-12">
                <div className="mb-5"><Icon name="checkCircle" size={48} strokeWidth={1.5} style={{ color: "#27ae60" }} /></div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: 700, color: "#1c2340" }}>{t("top.contact.envoyeTitre")}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 10, maxWidth: 400, lineHeight: 1.7 }}>
                  {t("top.contact.envoyeTexte")}
                </p>
                <button onClick={() => setSubmitted(false)}
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90">
                  {t("top.contact.nouveauMessage")}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 6 }}>
                  {t("top.contact.formTitre")}
                </h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#6b7280", marginBottom: 24 }}>
                  {t("top.contact.formChamps")}
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("top.contact.nomLabel")}</label>
                      <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                        placeholder={t("top.contact.nomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("top.contact.prenomLabel")}</label>
                      <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                        placeholder={t("top.contact.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("top.contact.emailLabel")}</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder={t("top.contact.emailPlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">{t("top.contact.telephoneLabel")}</label>
                      <input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                        placeholder={t("top.contact.telephonePlaceholder")} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("top.contact.sujetLabel")}</label>
                    <select required value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                      className={inputClass} style={inputStyle}>
                      <option value="general">{t("top.contact.sujetGeneral")}</option>
                      <option value="sacrement">{t("top.contact.sujetSacrement")}</option>
                      <option value="catechese">{t("top.contact.sujetCatechese")}</option>
                      <option value="don">{t("top.contact.sujetDon")}</option>
                      <option value="location">{t("top.contact.sujetLocation")}</option>
                      <option value="intention">{t("top.contact.sujetIntention")}</option>
                      <option value="bans">{t("top.contact.sujetBans")}</option>
                      <option value="autre">{t("top.contact.sujetAutre")}</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("top.contact.messageLabel")}</label>
                    <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t("top.contact.messagePlaceholder")} rows={6}
                      className={inputClass} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                      {error}
                    </div>
                  )}
                  <button type="submit"
                    style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.88rem" }}
                    className="w-full text-white py-4 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2">
                    <Icon name="mail" size={18} strokeWidth={1.75} /> {t("top.contact.envoyer")}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section style={{ background: "#F5F7FA" }} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20, textAlign: "center" }}>
            {t("top.contact.accesRapides")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "pray", titre: t("top.contact.rapideIntention"), desc: t("top.contact.rapideIntentionDesc"), to: "/celebrer" },
              { icon: "scroll", titre: t("top.contact.rapideBans"), desc: t("top.contact.rapideBansDesc"), to: "/celebrer#sacrements" },
              { icon: "newspaper", titre: t("top.contact.rapideJournal"), desc: t("top.contact.rapideJournalDesc"), to: "/se-nourrir#publications" },
            ].map((a) => (
              <Link to={a.to} key={a.titre}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all text-center group">
                <div className="mb-4"><Icon name={a.icon as IconName} size={32} style={{ color: "#0B3D91" }} /></div>
                <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 6 }}>{a.titre}</h4>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
