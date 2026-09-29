import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { apiGet, localDateISO } from "@/lib/api";
import { readingsList, type DailyReadings, type ReadingText } from "@/lib/content-types";

const font = { fontFamily: "Montserrat, sans-serif" };

const COLOR: Record<string, string> = {
  vert: "#15803d",
  violet: "#7e22ce",
  rouge: "#b91c1c",
  blanc: "#D4AF37",
  rose: "#db2777",
  noir: "#1c2340",
};

function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localDateISO(d);
}

function ReadingBlock({ text }: { text: ReadingText }) {
  return (
    <article className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 style={{ ...font, fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>{text.label.toUpperCase()}</h2>
        {text.ref && <span style={{ ...font, fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }}>{text.ref}</span>}
      </div>
      {text.title && (
        <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 6, lineHeight: 1.4 }}>{text.title}</h3>
      )}
      {text.intro && <p style={{ ...font, fontSize: "0.82rem", fontStyle: "italic", color: "#6b7280", marginBottom: 12 }}>{text.intro}</p>}
      {text.refrain && (
        <p style={{ ...font, fontSize: "0.88rem", fontWeight: 700, color: "#0B3D91", marginBottom: 12 }}>R/ {text.refrain}</p>
      )}
      {text.acclamation && (
        <div className="reading-text bg-yellow-50 rounded-xl px-4 py-3 mb-4" style={{ ...font, fontSize: "0.85rem", color: "#92400e", lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: text.acclamation }} />
      )}
      {text.format === "html" ? (
        <div className="reading-text" style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1f2937", lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: text.content }} />
      ) : (
        <p style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1f2937", lineHeight: 1.85, whiteSpace: "pre-line" }}>{text.content}</p>
      )}
    </article>
  );
}

export default function Lectures() {
  const [params, setParams] = useSearchParams();
  const today = localDateISO();
  const dateParam = params.get("date");
  const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today;
  const [readings, setReadings] = useState<DailyReadings | null | undefined>(undefined);

  useEffect(() => {
    setReadings(undefined);
    apiGet<DailyReadings | null>(`/lectures/jour?date=${date}`).then(setReadings).catch(() => setReadings(null));
  }, [date]);

  const goTo = (iso: string) => setParams(iso === today ? {} : { date: iso });
  const dateLong = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const texts = readings?.texts ?? [];
  const refs = readingsList(readings ?? null);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1400&h=500&fit=crop&auto=format" alt="Lectures du jour" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/se-nourrir" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Se nourrir</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ ...font, fontSize: "0.72rem", color: "#D4AF37" }}>Lectures du jour</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Lectures du jour</h1>
          <p style={{ ...font, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>La Parole de Dieu proclamée à la messe</p>
        </div>
      </div>

      <section className="py-10 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          {/* Day navigation */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap items-center justify-between gap-3 mb-6">
            <button onClick={() => goTo(shiftDate(date, -1))} style={{ ...font, fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }}
              className="px-3 py-2 rounded-full hover:bg-blue-50">← Veille</button>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <input type="date" value={date} onChange={(e) => e.target.value && goTo(e.target.value)}
                aria-label="Choisir une date"
                className="border border-gray-200 rounded-xl px-3 py-2" style={{ ...font, fontSize: "0.82rem", color: "#1c2340" }} />
              {date !== today && (
                <button onClick={() => goTo(today)} style={{ ...font, fontSize: "0.75rem", fontWeight: 700, color: "#D4AF37" }} className="hover:underline">
                  Aujourd'hui
                </button>
              )}
            </div>
            <button onClick={() => goTo(shiftDate(date, 1))} style={{ ...font, fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }}
              className="px-3 py-2 rounded-full hover:bg-blue-50">Lendemain →</button>
          </div>

          <div className="mb-6">
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", textTransform: "capitalize" }}>{dateLong}</div>
            {readings?.liturgical_day && (
              <div className="flex items-center gap-2 mt-1">
                {readings.color && (
                  <span title={`Couleur liturgique : ${readings.color}`} className="inline-block w-3 h-3 rounded-full border border-gray-200"
                    style={{ background: COLOR[readings.color.toLowerCase()] ?? "#9ca3af" }} />
                )}
                <span style={{ ...font, fontSize: "0.88rem", color: "#4b5563" }}>{readings.liturgical_day}</span>
              </div>
            )}
          </div>

          {readings === undefined ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#9ca3af" }}>Chargement des lectures…</p>
          ) : texts.length > 0 ? (
            <div className="space-y-5">
              {texts.map((t, i) => (
                <ReadingBlock key={`${t.type}-${i}`} text={t} />
              ))}
            </div>
          ) : refs.length > 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              {refs.map((r) => (
                <div key={r.label} className="flex gap-3 mb-2 last:mb-0" style={{ ...font, fontSize: "0.88rem" }}>
                  <span style={{ fontWeight: 700, color: "#0B3D91", minWidth: 110 }}>{r.label}</span>
                  <span style={{ color: "#374151" }}>{r.value}</span>
                </div>
              ))}
              {readings?.gospel_title && (
                <p style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", color: "#4b5563", marginTop: 10 }}>{readings.gospel_title}</p>
              )}
              <p style={{ ...font, fontSize: "0.78rem", color: "#9ca3af", marginTop: 14 }}>Le texte intégral de ces lectures n'est pas encore disponible.</p>
            </div>
          ) : (
            <p style={{ ...font, fontSize: "0.85rem", color: "#6b7280" }}>Lectures indisponibles pour ce jour pour le moment.</p>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/homelies" style={{ background: "#0B3D91", ...font, fontWeight: 700, fontSize: "0.8rem" }}
              className="text-white px-5 py-2.5 rounded-full hover:opacity-90">Écouter l'homélie</Link>
            <Link to="/celebrer/messes" style={{ border: "2px solid #0B3D91", color: "#0B3D91", ...font, fontWeight: 700, fontSize: "0.8rem" }}
              className="px-5 py-2.5 rounded-full hover:bg-blue-50">Horaires des messes</Link>
          </div>
          {readings?.source === "aelf" && (
            <p style={{ ...font, fontSize: "0.7rem", color: "#9ca3af", marginTop: 16 }}>Textes liturgiques © AELF — calendrier liturgique d'Afrique.</p>
          )}
        </div>
      </section>
    </>
  );
}
