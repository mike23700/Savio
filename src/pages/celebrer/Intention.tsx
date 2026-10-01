import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, apiPost, ApiError, localDateISO } from "@/lib/api";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

interface DayMass {
  time: string;
  type: string;
  note: string | null;
}

export default function Intention() {
  const { t } = useLang();
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", description: "", date: "", heure: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [masses, setMasses] = useState<DayMass[] | null>(null);

  useEffect(() => {
    setMasses(null);
    if (!form.date) return;
    let cancelled = false;
    apiGet<DayMass[]>(`/mass-schedule/day?date=${form.date}`)
      .then((list) => {
        if (cancelled) return;
        setMasses(list);
        setForm((f) => ({ ...f, heure: list.some((m) => m.time === f.heure) ? f.heure : list.length === 1 ? list[0].time : "" }));
      })
      .catch(() => !cancelled && setMasses([]));
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.date && masses && masses.length > 0 && !form.heure) {
      setError(t("celebrer.intention.erreurMesse"));
      return;
    }
    try {
      await apiPost("/intentions", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        description: form.description,
        date_souhaitee: form.date || null,
        heure_souhaitee: form.date ? form.heure || null : null,
      });
      setForm({ nom: "", prenom: "", email: "", telephone: "", description: "", date: "", heure: "" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("celebrer.form.erreurGenerique"));
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1400&h=500&fit=crop&auto=format" alt={t("celebrer.intention.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("celebrer.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("celebrer.intention.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("celebrer.intention.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("celebrer.intention.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-8 flex gap-4 items-start">
            <span style={{ flexShrink: 0, display: "flex" }}><Icon name="pray" size={28} /></span>
            <div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 4 }}>{t("celebrer.intention.offrandeTitre")}</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#92400e", lineHeight: 1.7 }}>
                {t("celebrer.intention.offrandeAvant")} <strong>3 000 FCFA</strong>. {t("celebrer.intention.offrandeApres")}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4"><Icon name="checkCircle" size={48} /></div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>{t("celebrer.intention.recueTitre")}</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                {t("celebrer.intention.recueTexte")}
              </p>
              <button onClick={() => setSubmitted(false)}
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                {t("celebrer.intention.nouvelle")}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.nom")}</label>
                    <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder={t("celebrer.intention.nomPlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("celebrer.intention.prenomLabel")}</label>
                    <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder={t("celebrer.intention.prenomPlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.email")}</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder={t("celebrer.form.emailPlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("celebrer.form.telephone")}</label>
                    <input required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder={t("celebrer.form.telephonePlaceholder")} className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("celebrer.intention.description")}</label>
                  <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t("celebrer.intention.descriptionPlaceholder")} rows={4} className={inputClass} style={{ ...inputStyle, resize: "vertical" as const }} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">{t("celebrer.intention.dateSouhaitee")}</label>
                  <input type="date" min={localDateISO()} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
                {form.date && (
                  <div>
                    <label style={labelStyle} className="block mb-1.5">{t("celebrer.intention.messeSouhaitee")}</label>
                    {masses === null ? (
                      <p style={{ ...inputStyle, color: "#9ca3af" }}>{t("celebrer.intention.chargement")}</p>
                    ) : masses.length === 0 ? (
                      <p className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3" style={{ ...inputStyle, color: "#92400e" }}>
                        {t("celebrer.intention.aucuneMesse")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {masses.map((m) => {
                          const selected = form.heure === m.time;
                          return (
                            <button type="button" key={`${m.time}-${m.type}`} onClick={() => setForm({ ...form, heure: m.time })}
                              aria-pressed={selected}
                              className="text-left rounded-xl px-4 py-3 border-2 transition-all"
                              style={{ borderColor: selected ? "#0B3D91" : "#e5e7eb", background: selected ? "#E8F2FF" : "white" }}>
                              <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#0B3D91" }}>{m.time}</span>
                              <span style={{ ...inputStyle, display: "block", fontWeight: 600, fontSize: "0.8rem" }}>{m.type}</span>
                              {m.note && <span style={{ ...inputStyle, display: "block", fontSize: "0.72rem", color: "#6b7280" }}>{m.note}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                    {error}
                  </div>
                )}
                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                  {t("celebrer.intention.envoyer")} <Icon name="cross" size={16} strokeWidth={1.75} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}