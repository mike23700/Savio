import { useEffect, useState } from "react";
import { Link } from "react-router";
import { mediaUrl } from "@/lib/api";
import { blocksOf, extraOf, loadPage, type PageContent } from "@/lib/pages";

export default function Histoire() {
  const [page, setPage] = useState<PageContent | null>(null);
  const timeline = blocksOf(page, "timeline");
  const milestones = blocksOf(page, "milestone");
  const extra = extraOf(page);

  useEffect(() => {
    loadPage("histoire").then(setPage).catch(() => setPage(null));
  }, []);

  function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img
          src={(page?.hero_image ? mediaUrl(page.hero_image) : null) ?? "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=600&fit=crop&auto=format"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{title}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{title}</h1>
          {subtitle && <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        title={page?.title ?? "Notre Histoire"}
        subtitle={page?.subtitle ?? "Plus de 60 ans de foi, de service et de communauté à Douala"}
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">CHRONOLOGIE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 40 }}>Dates clés de la paroisse</h2>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-6 relative">
                  <div style={{ width: 48, height: 48, background: "#0B3D91", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: "1.1rem" }}>✝</span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 flex-1 hover:border-yellow-200 hover:shadow-sm transition-all">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 4 }}>{(item.meta ?? "").toUpperCase()}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "1rem", marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#F5F7FA" }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">
            {String(extra.youpwe_label ?? "EXTENSION")}
          </div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>
            {String(extra.youpwe_title ?? "L'extension vers Youpwè")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 40, maxWidth: 640 }}>
            {String(extra.youpwe_intro ?? "Dans les années 1990, la paroisse a étendu sa mission vers le quartier de Youpwè.")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {milestones.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all">
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#0B3D91", letterSpacing: "0.08em", marginBottom: 4 }}>{item.meta}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "0.95rem", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-8 px-4 bg-white flex justify-center gap-4 flex-wrap">
        <Link to="/paroisse/genese"
          style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
          ← Genèse
        </Link>
        <Link to="/paroisse"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
          La Paroisse →
        </Link>
      </div>
    </>
  );
}
