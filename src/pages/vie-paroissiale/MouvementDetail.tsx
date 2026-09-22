import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { apiGet } from "@/lib/api";

interface MouvementDetail {
  id: number;
  slug: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  content: string | null;
  image: string | null;
  details: { id: number; detail: string }[];
}

const CATEGORY_LABEL: Record<string, string> = {
  conseil: "Conseils",
  mouvement: "Mouvements",
  chorale: "Chorales",
  cev: "CEV",
};

export default function MouvementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MouvementDetail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setItem(null);
    setNotFound(false);
    apiGet<MouvementDetail>(`/mouvements/${id}`).then(setItem).catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">⛪</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>Introuvable</h1>
        <Link to="/vie-paroissiale/mouvements"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          ← Retour
        </Link>
      </div>
    );
  }

  if (!item) return null;

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src={item.image || "https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format"} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale/mouvements" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{CATEGORY_LABEL[item.category] || "Mouvements"}</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{item.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{item.icon}</span>
            <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700 }}>{item.title}</h1>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", color: "#4b5563", lineHeight: 1.8, marginBottom: 20, whiteSpace: "pre-line" }}>
            {item.content || item.description}
          </p>

          {item.details.length > 0 && (
            <div style={{ background: "#F5F7FA", borderRadius: 16, padding: "24px 28px" }}>
              {item.details.map((d) => (
                <div key={d.id} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0B3D91", flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#4b5563", lineHeight: 1.7 }}>{d.detail}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-10 flex-wrap">
            <Link to="/vie-paroissiale/mouvements"
              style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
              ← Retour
            </Link>
            <Link to="/contact"
              style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Contacter le secrétariat →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
