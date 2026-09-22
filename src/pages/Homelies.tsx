import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Homelie {
  id: number;
  title: string;
  slug: string;
  priest: string;
  readings: string;
  sunday: string;
  duration: string;
  excerpt: string;
  img: string;
  published_at: string;
}

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 inline ml-1">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function Homelies() {
  const { user } = useAuth();
  const [homelies, setHomelies] = useState<Homelie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Homelie | null>(null);

  useEffect(() => {
    apiGet<Homelie[]>("/homelies").then(setHomelies).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    apiGet<Homelie[]>("/favorites").then(favs => setFavoriteIds(new Set(favs.map(f => f.id)))).catch(() => {});
  }, [user]);

  async function toggleFavorite(id: number, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!user) return;
    if (favoriteIds.has(id)) {
      await apiDelete(`/favorites/${id}`);
      setFavoriteIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    } else {
      await apiPost(`/favorites/${id}`);
      setFavoriteIds(prev => new Set(prev).add(id));
    }
  }

  const filtered = homelies.filter(h =>
    !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.sunday.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format"
          alt="Homélies" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Homélies</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Homélies</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            Retrouvez les homélies dominicales de notre paroisse
          </p>
        </div>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une homélie..."
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" }}
              className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          </div>

          {/* Featured - latest homily */}
          {!search && homelies[0] && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative min-h-[220px] overflow-hidden">
                  <img src={homelies[0].img} alt={homelies[0].title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,45,107,0.7), transparent)" }} />
                  <div className="absolute top-4 left-4">
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700, background: "#D4AF37", color: "white", letterSpacing: "0.08em" }}
                      className="px-2.5 py-1 rounded-full">DERNIÈRE HOMÉLIE</span>
                  </div>
                  {user && (
                    <button onClick={(e) => toggleFavorite(homelies[0].id, e)}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-9 h-9 flex items-center justify-center transition-all text-lg">
                      {favoriteIds.has(homelies[0].id) ? "❤️" : "🤍"}
                    </button>
                  )}
                </div>
                <div className="p-8 bg-blue-50">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af" }} className="mb-2">{formatDate(homelies[0].published_at)}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37" }} className="mb-2">{homelies[0].sunday.toUpperCase()}</div>
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.3, marginBottom: 8 }}>{homelies[0].title}</h2>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#6b7280", marginBottom: 12 }}>📖 {homelies[0].readings}</div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563", lineHeight: 1.75, marginBottom: 16 }}>{homelies[0].excerpt}</p>
                  <button onClick={() => setSelected(homelies[0])}
                    style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                    🎙️ Écouter l'homélie
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Homilies grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.slice(search ? 0 : 1).map(h => (
              <div key={h.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all group cursor-pointer"
                onClick={() => setSelected(h)}>
                <div className="flex gap-0">
                  <div className="relative w-32 shrink-0 overflow-hidden">
                    <img src={h.img} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex-1 relative">
                    {user && (
                      <button onClick={(e) => toggleFavorite(h.id, e)} className="absolute top-3 right-3 text-base">
                        {favoriteIds.has(h.id) ? "❤️" : "🤍"}
                      </button>
                    )}
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "#9ca3af" }}>{formatDate(h.published_at)}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", marginTop: 2, marginBottom: 4 }}>
                      {h.sunday.length > 30 ? h.sunday.slice(0, 30) + "…" : h.sunday}
                    </div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.9rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.3, marginBottom: 6 }}>{h.title}</h3>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af" }}>⏱ {h.duration}</div>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "#0B3D91", fontWeight: 700 }}
                      className="flex items-center gap-1 mt-3">🎙️ Écouter <IconArrow /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Homily modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-48">
              <img src={selected.img} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "rgba(8,45,107,0.75)" }} />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", marginBottom: 4 }}>{selected.sunday.toUpperCase()}</div>
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "white" }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all text-sm">✕</button>
              {user && (
                <button onClick={(e) => toggleFavorite(selected.id, e)} className="absolute top-4 right-14 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition-all text-sm">
                  {favoriteIds.has(selected.id) ? "❤️" : "🤍"}
                </button>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-5 text-sm">
                {[["📅", formatDate(selected.published_at)], ["👤", selected.priest], ["📖", selected.readings], ["⏱", selected.duration]].map(([icon, val]) => (
                  <div key={val} className="flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#6b7280" }}>{val}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.87rem", color: "#4b5563", lineHeight: 1.8, marginBottom: 20 }}>{selected.excerpt}</p>
              <div className="flex gap-3">
                <button style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl hover:opacity-90 transition-opacity">
                  🎙️ Écouter l'homélie
                </button>
                <button style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
                  className="px-4 py-3 rounded-xl hover:bg-blue-50 transition-all">
                  ⬇️ PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
