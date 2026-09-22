import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";

type Tab = "conseil" | "mouvement" | "chorale" | "cev";

interface MouvementItem {
  id: number;
  slug: string;
  icon: string;
  title: string;
  description: string;
  color: string | null;
}

const TAB_META: Record<Tab, { label: string; kicker: string; heading: string; intro?: string }> = {
  conseil: { label: "🏛️ Conseils", kicker: "GOUVERNANCE", heading: "Les Conseils paroissiaux" },
  mouvement: { label: "✋ Mouvements", kicker: "ASSOCIATIONS", heading: "Mouvements de la paroisse" },
  chorale: { label: "🎵 Chorales", kicker: "MUSIQUE SACRÉE", heading: "Les Chorales" },
  cev: {
    label: "🏘️ CEV", kicker: "COMMUNAUTÉS", heading: "Communautés Ecclésiales Vivantes (CEV)",
    intro: "Les CEV sont de petites communautés de quartier qui permettent aux fidèles de vivre leur foi ensemble au plus proche de leur lieu de vie. Elles forment la base vivante de notre paroisse.",
  },
};

export default function Mouvements() {
  const [tab, setTab] = useState<Tab>("conseil");
  const [items, setItems] = useState<MouvementItem[]>([]);

  useEffect(() => {
    apiGet<MouvementItem[]>(`/mouvements?category=${tab}`).then(setItems).catch(() => setItems([]));
  }, [tab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "conseil", label: TAB_META.conseil.label },
    { id: "mouvement", label: TAB_META.mouvement.label },
    { id: "chorale", label: TAB_META.chorale.label },
    { id: "cev", label: TAB_META.cev.label },
  ];
  const meta = TAB_META[tab];

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format" alt="Mouvements & Groupes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Vie Paroissiale</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Mouvements & Groupes</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Mouvements & Groupes</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>La vie communautaire de notre paroisse</p>
        </div>
      </div>

      <section style={{ background: "#F5F7FA" }} className="px-4 py-6 sticky top-[73px] z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, background: tab === t.id ? "#0B3D91" : "white", color: tab === t.id ? "white" : "#374151", border: tab === t.id ? "1px solid #0B3D91" : "1px solid #e5e7eb" }}
              className="px-5 py-2.5 rounded-full hover:opacity-90 transition-all">
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{meta.kicker}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: meta.intro ? 12 : 32 }}>{meta.heading}</h2>
          {meta.intro && (
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 32 }}>{meta.intro}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link key={item.id} to={`/vie-paroissiale/mouvements/${item.slug}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all flex gap-5">
                <div style={{ width: 56, height: 56, background: item.color === "#0B3D91" ? "#E8F2FF" : "#FDF8E7", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7 }}>{item.description}</p>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700, display: "inline-block", marginTop: 8 }}>En savoir plus →</span>
                </div>
              </Link>
            ))}
          </div>

          {tab === "cev" && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center mt-8">
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#374151", lineHeight: 1.7 }}>
                Pour rejoindre une CEV de votre quartier, inscrivez-vous au registre paroissial ou contactez le secrétariat.
              </p>
              <Link to="/vie-paroissiale/registre"
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full mt-4 hover:opacity-90 transition-opacity">
                S'inscrire au registre →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
