import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, clientTimeQuery, localDateISO } from "@/lib/api";
import { readingsList, type DailyReadings } from "@/lib/content-types";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

interface ScheduleGroup {
  day: string;
  times: { id: number; time: string | null; type: string; note: string | null }[];
}

interface TodayItem {
  time: string;
  type: string;
  note: string | null;
}

export default function Messes() {
  const { t, lang } = useLang();
  const [schedule, setSchedule] = useState<ScheduleGroup[]>([]);
  const [todayItems, setTodayItems] = useState<TodayItem[]>([]);
  const [readings, setReadings] = useState<DailyReadings | null>(null);
  const today = localDateISO();

  useEffect(() => {
    apiGet<ScheduleGroup[]>("/mass-schedule").then(setSchedule).catch(() => {});
    apiGet<TodayItem[]>(`/mass-schedule/today${clientTimeQuery()}`).then(setTodayItems).catch(() => {});
    apiGet<DailyReadings | null>(`/lectures/jour?date=${today}`).then(setReadings).catch(() => {});
  }, [today]);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format" alt={t("celebrer.messes.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("celebrer.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("celebrer.messes.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("celebrer.messes.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("celebrer.messes.sousTitre")}</p>
        </div>
      </div>

      <section className="py-8 px-4" style={{ background: "#E8F2FF" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ background: "#0B3D91", borderRadius: 20, padding: 32, color: "white" }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em", marginBottom: 8 }}>
              {t("celebrer.messes.aujourdhui").replace("{date}", new Date().toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase())}
            </div>
            {todayItems.length === 0 ? (
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
                {t("celebrer.messes.aucuneCelebration")}
              </p>
            ) : (
              <>
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "white", marginBottom: 12 }}>
                  {t("celebrer.messes.programmeJour")}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {todayItems.map((item, i) => (
                    <div key={`${item.time}-${i}`} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#D4AF37", minWidth: 64 }}>{item.time}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", fontWeight: 600 }}>{item.type}</span>
                      {item.note && <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>· {item.note}</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 12 }}>{t("celebrer.messes.lecturesTitre")}</div>
              {(() => {
                const refs = readingsList(readings);
                if (refs.length === 0) {
                  return (
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>
                      {t("celebrer.messes.lecturesVides")}
                    </p>
                  );
                }
                return (
                  <>
                    {readings?.liturgical_day && (
                      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "white", marginBottom: 8 }}>
                        {readings.liturgical_day}
                      </div>
                    )}
                    {refs.map((r) => (
                      <div key={r.label} className="flex items-center gap-3 mb-2 last:mb-0">
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", minWidth: 92 }}>{r.label}</span>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.85)" }}>{r.value}</span>
                      </div>
                    ))}
                    {readings?.gospel_title && (
                      <div style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", marginTop: 8 }}>
                        {readings.gospel_title}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3">
                      <Link to="/lectures"
                        style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", fontWeight: 700, color: "#D4AF37" }}
                        className="inline-flex items-center gap-1 hover:underline">
                        {t("celebrer.messes.lireTextes")}<Icon name="arrowRight" size={16} />
                      </Link>
                      <Link to="/homelies" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", fontWeight: 700, color: "#D4AF37" }}
                        className="inline-flex items-center gap-1 hover:underline">
                        {t("celebrer.messes.ecouterHomelie")}<Icon name="arrowRight" size={16} />
                      </Link>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("celebrer.messes.surtitre")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 32 }}>{t("celebrer.messes.titre")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {schedule.map((s) => (
              <div key={s.day} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all">
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em" }} className="mb-3">{s.day.toUpperCase()}</div>
                {s.times.map((t) => (
                  <div key={t.time + t.type} className="mb-4 last:mb-0">
                    <div className="flex items-baseline gap-3">
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#0B3D91" }}>{t.time}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 600, color: "#1c2340" }}>{t.type}</span>
                    </div>
                    {t.note && <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#9ca3af", marginTop: 2, lineHeight: 1.5 }}>{t.note}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-10 bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}><Icon name="mapPin" size={18} /> {t("celebrer.messes.lieuTitre")}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}>
                  {t("celebrer.messes.lieuTexte")}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="https://goo.gl/maps/bPGHqwpVQrioTF7n6" target="_blank" rel="noreferrer"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                  <Icon name="mapPin" size={16} /> {t("celebrer.messes.voirCarte")}
                </a>
                <button
                  onClick={() => alert(t("celebrer.messes.bulletinCarte"))}
                  style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors">
                  <Icon name="fileText" size={16} /> {t("celebrer.messes.bulletinPdf")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}