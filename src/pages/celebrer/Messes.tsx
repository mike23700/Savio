import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";

interface ScheduleGroup {
  day: string;
  times: { id: number; time: string | null; type: string; note: string | null }[];
}

export default function Messes() {
  const [schedule, setSchedule] = useState<ScheduleGroup[]>([]);

  useEffect(() => {
    apiGet<ScheduleGroup[]>("/mass-schedule").then(setSchedule).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format" alt="Horaires des messes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Célébrer</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Horaires des messes</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Horaires des messes</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Rejoignez-nous pour célébrer l'Eucharistie</p>
        </div>
      </div>

      {/* Messe du jour */}
      <section className="py-8 px-4" style={{ background: "#E8F2FF" }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ background: "#0B3D91", borderRadius: 20, padding: 32, color: "white" }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em", marginBottom: 8 }}>AUJOURD'HUI · 15 SEPTEMBRE 2026</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "white", marginBottom: 4 }}>Fête de la Croix Glorieuse</h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>Messe de 06h30</p>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 12 }}>LECTURES DU JOUR</div>
              {[
                { ref: "Nb 21,4-9", titre: "1ère lecture – Le serpent d'airain" },
                { ref: "Ph 2,6-11", titre: "2ème lecture – L'hymne christologique" },
                { ref: "Jn 3,13-17", titre: "Évangile – Dieu a tant aimé le monde" },
              ].map((lecture) => (
                <div key={lecture.ref} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", minWidth: 80 }}>{lecture.ref}</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.8)" }}>{lecture.titre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">CÉLÉBRATIONS</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 32 }}>Horaires des messes</h2>

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
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>📍 Lieu des célébrations</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}>
                  Rue de la Messe Bonadoumbé, Douala · Toutes nos messes se déroulent dans l'église principale.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="https://goo.gl/maps/bPGHqwpVQrioTF7n6" target="_blank" rel="noreferrer"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                  📍 Voir sur la carte
                </a>
                <button
                  onClick={() => alert("Téléchargement du bulletin PDF...")}
                  style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors">
                  📄 Bulletin PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
