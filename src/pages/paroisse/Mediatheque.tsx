import { useState } from "react";
import { Link } from "react-router";
import { useSettings } from "@/lib/settings";

const GALLERY_IMGS = [
  { src: "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=600&h=400&fit=crop&auto=format", alt: "Communauté en prière", cat: "Célébrations" },
  { src: "https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=600&h=400&fit=crop&auto=format", alt: "Rassemblement communautaire", cat: "Communauté" },
  { src: "https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=600&h=400&fit=crop&auto=format", alt: "Cierges en prière", cat: "Célébrations" },
  { src: "https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=600&h=400&fit=crop&auto=format", alt: "Autel de l'église", cat: "Église" },
  { src: "https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=600&h=400&fit=crop&auto=format", alt: "Prière en église", cat: "Célébrations" },
  { src: "https://images.unsplash.com/photo-1774685398923-ba001b371579?w=600&h=400&fit=crop&auto=format", alt: "Catéchèse", cat: "Catéchèse" },
  { src: "https://images.unsplash.com/photo-1763517789508-f23012039417?w=600&h=400&fit=crop&auto=format", alt: "Formation spirituelle", cat: "Formation" },
  { src: "https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=600&h=400&fit=crop&auto=format", alt: "Adoration", cat: "Célébrations" },
];

const CATS = ["Tous", "Célébrations", "Communauté", "Église", "Catéchèse", "Formation"];

export default function ParoisseMediatheque() {
  const settings = useSettings();
  const youtubeUrl = settings["social.youtube_url"] || "#";
  const [tab, setTab] = useState<"galerie" | "videos">("galerie");
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = GALLERY_IMGS.filter(img => filter === "Tous" || img.cat === filter);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=500&fit=crop&auto=format" alt="Médiathèque" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Médiathèque</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Médiathèque</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Photos et vidéos de la paroisse</p>
        </div>
      </div>

      <section style={{ background: "#F5F7FA" }} className="px-4 py-6 sticky top-[73px] z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {(["galerie", "videos"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, background: tab === t ? "#0B3D91" : "white", color: tab === t ? "white" : "#374151", border: tab === t ? "1px solid #0B3D91" : "1px solid #e5e7eb" }}
              className="px-5 py-2.5 rounded-full hover:opacity-90 transition-all">
              {t === "galerie" ? "🖼️ Galerie photos" : "▶️ Vidéos"}
            </button>
          ))}
        </div>
      </section>

      {tab === "galerie" && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {CATS.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700, background: filter === cat ? "#0B3D91" : "#F5F7FA", color: filter === cat ? "white" : "#374151", border: `1px solid ${filter === cat ? "#0B3D91" : "#e5e7eb"}` }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all">{cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square" onClick={() => setLightbox(img.src)}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                  </div>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.6rem", fontWeight: 700, background: "rgba(8,45,107,0.85)", color: "#D4AF37" }}
                    className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full">{img.cat.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          {lightbox && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
              <img src={lightbox.replace("w=600&h=400", "w=1200&h=800")} alt="Vue agrandie" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
              <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300" onClick={() => setLightbox(null)}>✕</button>
            </div>
          )}
        </section>
      )}

      {tab === "videos" && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center py-16">
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1000&h=560&fit=crop&auto=format" alt="Chaîne YouTube de la paroisse" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(8,45,107,0.55)" }}>
                <div style={{ width: 64, height: 64, background: "#ff0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.6rem", color: "white", marginLeft: 4 }}>▶</span>
                </div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "white", marginTop: 12 }}>Chaîne YouTube de la paroisse</h3>
              </div>
            </a>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 16, lineHeight: 1.7 }}>
              Retrouvez nos messes en direct, nos homélies et les temps forts de la paroisse sur notre chaîne YouTube.
            </p>
            <a href={youtubeUrl} target="_blank" rel="noreferrer"
              style={{ background: "#ff0000", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.88rem" }}
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
              ▶️ Voir la chaîne YouTube
            </a>
          </div>
        </section>
      )}
    </>
  );
}
