import { useEffect, useState } from "react";
import { Link } from "react-router";
import { mediaUrl } from "@/lib/api";
import { blocksOf, extraOf, loadPage, type PageContent } from "@/lib/pages";

export default function Organisation() {
  const [page, setPage] = useState<PageContent | null>(null);
  const structure = blocksOf(page, "bullet");
  const stats = blocksOf(page, "stat");
  const cards = blocksOf(page, "card");
  const extra = extraOf(page);

  useEffect(() => {
    loadPage("organisation").then(setPage).catch(() => setPage(null));
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src={(page?.hero_image ? mediaUrl(page.hero_image) : null) ?? "https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format"}
          alt={page?.title ?? "Organisation"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{page?.title ?? "Organisation"}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{page?.title ?? "Organisation de la paroisse"}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{page?.subtitle ?? "Structure pastorale et gouvernance"}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {structure.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>
                  {String(extra.structure_title ?? "Structure pastorale")}
                </h3>
                {structure.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", flexShrink: 0 }} />
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563" }}>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
            {stats.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>
                  {String(extra.stats_title ?? "Chiffres clés")}
                </h3>
                {stats.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563" }}>{item.title}</span>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#0B3D91" }}>{item.meta}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cards.length > 0 && (
            <div style={{ background: "#F5F7FA", borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>
                {String(extra.chart_title ?? "Organigramme pastoral")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {cards.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all">
                    <span style={{ fontSize: "1.8rem", display: "block", marginBottom: 10 }}>{item.icon}</span>
                    <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", marginBottom: 6, fontSize: "0.95rem" }}>{item.title}</h4>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
