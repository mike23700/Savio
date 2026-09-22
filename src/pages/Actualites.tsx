import { useState } from "react";
import { Link, useParams } from "react-router";
import { NEWS } from "@/data/content";

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 inline ml-1">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ALL_TAGS = ["Tous", ...Array.from(new Set(NEWS.map(n => n.tag)))];

export function ActualiteDetail() {
  const { id } = useParams();
  const article = NEWS.find(n => n.id === Number(id));

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340" }}>Article introuvable</h2>
        <Link to="/actualites" style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90">
          Retour aux actualités <IconArrow />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.3) 60%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/actualites" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Actualités</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{article.tag}</span>
          </div>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem", fontWeight: 700, background: article.tagColor, color: "white", letterSpacing: "0.08em" }}
            className="inline-block px-3 py-1 rounded-full mb-3">{article.tag.toUpperCase()}</span>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, lineHeight: 1.2 }}>{article.title}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", marginTop: 8 }}>{article.date}</p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", color: "#4b5563", lineHeight: 1.85, marginBottom: 24, fontStyle: "italic", borderLeft: "3px solid #D4AF37", paddingLeft: 20 }}>
          {article.excerpt}
        </p>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.92rem", color: "#374151", lineHeight: 1.9, whiteSpace: "pre-line" }}>
          {article.content}
        </div>
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-3">
          <Link to="/actualites"
            style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
            className="flex items-center gap-1 px-5 py-2.5 rounded-full hover:bg-blue-50 transition-all">
            ← Toutes les actualités
          </Link>
          <Link to="/contact"
            style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
            className="flex items-center gap-1 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Nous contacter <IconArrow />
          </Link>
        </div>

        {/* Related */}
        <div className="mt-14">
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>Articles similaires</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {NEWS.filter(n => n.id !== article.id).slice(0, 2).map(n => (
              <Link to={`/actualites/${n.id}`} key={n.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
                <img src={n.img} alt={n.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-4">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "#9ca3af" }}>{n.date}</div>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.9rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.4, marginTop: 4 }}>{n.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

export default function Actualites() {
  const [activeTag, setActiveTag] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = NEWS.filter(n => {
    const matchTag = activeTag === "Tous" || n.tag === activeTag;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format"
          alt="Actualités" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Actualités</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Actualités & Annonces</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            Restez informé de la vie de votre paroisse
          </p>
        </div>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une actualité..."
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" }}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700,
                    background: activeTag === tag ? "#0B3D91" : "white",
                    color: activeTag === tag ? "white" : "#374151",
                    border: activeTag === tag ? "1px solid #0B3D91" : "1px solid #e5e7eb",
                  }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all whitespace-nowrap">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280" }}>Aucun article trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(n => (
                <Link to={`/actualites/${n.id}`} key={n.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 hover:border-yellow-200">
                  <div className="relative h-48 overflow-hidden">
                    <img src={n.img} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700, background: n.tagColor, color: "white", letterSpacing: "0.08em" }}
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full">{n.tag.toUpperCase()}</span>
                  </div>
                  <div className="p-5">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af", marginBottom: 6 }}>{n.date}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.45, marginBottom: 8 }}>{n.title}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>{n.excerpt.slice(0, 120)}…</p>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700 }}
                      className="flex items-center gap-1">Lire la suite <IconArrow /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
