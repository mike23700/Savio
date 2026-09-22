import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { apiGet } from "@/lib/api";

interface Photo {
  id: number;
  url: string;
}

interface ProjetDetail {
  id: number;
  titre: string;
  description: string;
  statut: "en_cours" | "termine";
  objectif: number;
  collecte: number;
  image: string;
  details: string;
  photos: Photo[];
}

const STATUT_LABEL: Record<ProjetDetail["statut"], string> = { en_cours: "En cours", termine: "Terminé" };

function formatMontant(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function ProjetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [projet, setProjet] = useState<ProjetDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setProjet(null);
    setNotFound(false);
    apiGet<ProjetDetail>(`/projets/${id}`).then(setProjet).catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">⛪</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>Projet introuvable</h1>
        <Link to="/vie-paroissiale/projets"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          ← Retour aux projets
        </Link>
      </div>
    );
  }

  if (!projet) return null;

  const pct = Math.min(100, Math.round((projet.collecte / projet.objectif) * 100));

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src={projet.image} alt={projet.titre} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale/projets" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Projets</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{projet.titre}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700 }}>{projet.titre}</h1>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <span style={{ background: projet.statut === "termine" ? "#27ae60" : "#D4AF37", borderRadius: 20, padding: "4px 14px", fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "white", display: "inline-block", marginBottom: 20 }}>
            {STATUT_LABEL[projet.statut]}
          </span>

          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.8, marginBottom: 24 }}>
            {projet.details || projet.description}
          </p>

          <div style={{ background: "#F5F7FA", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280" }}>Objectif</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#1c2340" }}>{formatMontant(projet.objectif)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280" }}>Collecté</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }}>{formatMontant(projet.collecte)}</span>
            </div>
            <div style={{ background: "#e5e7eb", borderRadius: 20, height: 10, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: projet.statut === "termine" ? "#27ae60" : "#0B3D91", borderRadius: 20 }} />
            </div>
          </div>

          {projet.photos.length > 0 && (
            <div className="mb-10">
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">GALERIE PHOTOS</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projet.photos.map((p) => (
                  <button key={p.id} onClick={() => setLightbox(p.url)} className="relative h-28 rounded-xl overflow-hidden">
                    <img src={p.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/don"
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="text-white py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
              ❤️ Soutenir ce projet
            </Link>
            <Link to="/vie-paroissiale/projets"
              style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              ← Tous les projets
            </Link>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </>
  );
}
