import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";

interface Projet {
  id: number;
  titre: string;
  description: string;
  statut: "en_cours" | "termine";
  objectif: number;
  collecte: number;
  image: string;
}

const STATUT_LABEL: Record<Projet["statut"], string> = { en_cours: "En cours", termine: "Terminé" };

function formatMontant(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function Projets() {
  const [filter, setFilter] = useState<"Tous" | Projet["statut"]>("Tous");
  const [projets, setProjets] = useState<Projet[]>([]);

  useEffect(() => {
    apiGet<Projet[]>("/projets").then(setProjets).catch(() => {});
  }, []);

  const filtered = projets.filter(p => filter === "Tous" || p.statut === filter);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format" alt="Projets" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Vie Paroissiale</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Projets</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Projets paroissiaux</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Construire ensemble l'avenir de notre paroisse</p>
        </div>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {(["Tous", "en_cours", "termine"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, background: filter === f ? "#0B3D91" : "#F5F7FA", color: filter === f ? "white" : "#374151", border: `1px solid ${filter === f ? "#0B3D91" : "#e5e7eb"}` }}
                className="px-5 py-2.5 rounded-full hover:opacity-90 transition-all">{f === "Tous" ? "Tous" : STATUT_LABEL[f]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((projet) => {
              const pct = Math.min(100, Math.round((projet.collecte / projet.objectif) * 100));
              return (
                <Link key={projet.id} to={`/vie-paroissiale/projets/${projet.id}`} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-yellow-200 transition-all block">
                  <div className="relative h-44 overflow-hidden">
                    <img src={projet.image} alt={projet.titre} className="w-full h-full object-cover" />
                    <span style={{ position: "absolute", top: 12, right: 12, background: projet.statut === "termine" ? "#27ae60" : "#D4AF37", borderRadius: 20, padding: "4px 12px", fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "white" }}>
                      {STATUT_LABEL[projet.statut]}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 6, lineHeight: 1.3 }}>{projet.titre}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{projet.description}</p>

                    <div className="mb-2 flex justify-between">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#6b7280" }}>Collecte</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#0B3D91" }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#e5e7eb", borderRadius: 20, height: 8, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: projet.statut === "termine" ? "#27ae60" : "#0B3D91", borderRadius: 20, transition: "width 0.5s ease" }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#6b7280" }}>{formatMontant(projet.collecte)}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af" }}>/ {formatMontant(projet.objectif)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
