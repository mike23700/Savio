import { useState } from "react";
import { Link } from "react-router";
import { EVENTS } from "@/data/content";

const CATEGORIES = ["Tous", "Messe", "Sacrement", "Adoration", "Catéchèse", "Communauté", "Spiritualité"];

const CAT_COLORS: Record<string, string> = {
  Messe: "#0B3D91",
  Sacrement: "#D4AF37",
  Adoration: "#7c3aed",
  Catéchèse: "#059669",
  Communauté: "#d97706",
  Spiritualité: "#dc2626",
};

export default function Agenda() {
  const [activeCat, setActiveCat] = useState("Tous");

  const filtered = EVENTS.filter(e => activeCat === "Tous" || e.category === activeCat);

  const grouped = filtered.reduce((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {} as Record<string, typeof EVENTS>);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1400&h=500&fit=crop&auto=format"
          alt="Agenda" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Agenda</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Agenda paroissial</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            Tous les événements et célébrations de la paroisse
          </p>
        </div>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{
                  fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700,
                  background: activeCat === cat ? (CAT_COLORS[cat] || "#0B3D91") : "white",
                  color: activeCat === cat ? "white" : "#374151",
                  border: `1px solid ${activeCat === cat ? (CAT_COLORS[cat] || "#0B3D91") : "#e5e7eb"}`,
                }}
                className="px-4 py-2 rounded-full hover:opacity-90 transition-all whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>

          {/* Events list */}
          <div className="space-y-8">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, events]) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <div style={{ width: 40, height: 40, background: "#0B3D91", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "white", lineHeight: 1 }}>
                      {new Date(date + "T00:00:00").getDate()}
                    </span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.5rem", color: "rgba(255,255,255,0.7)", lineHeight: 1, textTransform: "uppercase" }}>
                      {new Date(date + "T00:00:00").toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", textTransform: "capitalize" }}>
                      {formatDate(date)}
                    </h3>
                  </div>
                  <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                </div>
                <div className="ml-14 space-y-3">
                  {events.map(ev => (
                    <div key={ev.id}
                      className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all">
                      <div style={{ minWidth: 56, fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#0B3D91" }}>{ev.time}</div>
                      <div className="flex-1">
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#1c2340" }}>{ev.title}</div>
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "#9ca3af", marginTop: 2 }}>📍 {ev.location}</div>
                      </div>
                      <span style={{
                        fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700,
                        background: (CAT_COLORS[ev.category] || "#6b7280") + "18",
                        color: CAT_COLORS[ev.category] || "#6b7280",
                        border: `1px solid ${(CAT_COLORS[ev.category] || "#6b7280")}30`,
                        letterSpacing: "0.06em", flexShrink: 0
                      }} className="px-2.5 py-1 rounded-full">
                        {ev.category.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">📅</div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280" }}>Aucun événement pour cette catégorie.</p>
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center">
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>
              Vous souhaitez réserver la salle paroissiale ?
            </h3>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginBottom: 16, lineHeight: 1.7 }}>
              Pour tout événement communautaire, contactez le secrétariat paroissial.
            </p>
            <Link to="/contact"
              style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Contacter le secrétariat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
