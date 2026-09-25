import { useEffect, useState } from "react";
import { Link } from "react-router";
import { mediaUrl } from "@/lib/api";
import { blocksOf, extraOf, introParagraphs, loadPage, renderInline, type PageContent } from "@/lib/pages";

const CURE_FALLBACK_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=380&fit=crop&auto=format";

export default function Genese() {
  const [page, setPage] = useState<PageContent | null>(null);
  const cures = blocksOf(page, "cure");
  const timeline = blocksOf(page, "timeline");
  const extra = extraOf(page);
  const paragraphs = introParagraphs(page?.intro ?? null);

  useEffect(() => {
    loadPage("genese").then(setPage).catch(() => setPage(null));
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img
          src={(page?.hero_image ? mediaUrl(page.hero_image) : null) ?? "https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1400&h=600&fit=crop&auto=format"}
          alt={page?.title ?? "Genèse de la Paroisse"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{page?.title ?? "Genèse"}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{page?.title ?? "Genèse de la Paroisse"}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{page?.subtitle ?? "Les origines et fondements de notre communauté de foi à Douala"}</p>
        </div>
      </div>

      {/* Section 1 : Origines */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">
            {String(extra.section_label ?? "LES ORIGINES")}
          </div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>
            {String(extra.section_title ?? "1961 : La naissance d'une communauté")}
          </h2>

          {paragraphs.length > 0 && (
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.92rem", color: "#4b5563", lineHeight: 1.9 }} className="space-y-6 mb-12">
              {paragraphs.map((p, i) => (
                <p key={i}>{renderInline(p)}</p>
              ))}
            </div>
          )}

          {/* Dates-clés */}
          {timeline.length > 0 && (
            <div style={{ borderLeft: "3px solid #D4AF37", paddingLeft: 28 }} className="space-y-10 mb-16">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-5">
                  <div className="shrink-0 pt-1">
                    <div style={{ width: 64, minHeight: 64, background: "#0B3D91", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 6px" }}>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", textAlign: "center", lineHeight: 1.3 }}>{item.meta}</span>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "1.05rem", marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.84rem", color: "#6b7280", lineHeight: 1.7 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quote */}
          <div className="bg-blue-50 rounded-2xl p-10 border border-blue-100 text-center mb-16">
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>✝</div>
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", fontStyle: "italic", color: "#0B3D91", lineHeight: 1.7 }}>
              "{String(extra.quote ?? "L'Église naît là où l'on annonce l'Évangile, là où on rassemble les hommes et les femmes au nom du Christ.")}"
            </blockquote>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#9ca3af", marginTop: 16 }}>
              {String(extra.quote_author ?? "— Esprit de la fondation de la Paroisse Saint Dominique Savio, 1961")}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Curés successifs */}
      <section className="py-20 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">
            {String(extra.timeline_label ?? "SUCCESSION PASTORALE")}
          </div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>
            {String(extra.timeline_title ?? "Les curés qui nous ont précédés")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 48, lineHeight: 1.7, maxWidth: 600 }}>
            {String(extra.timeline_intro ?? "Depuis 1964, quatorze prêtres ont guidé notre communauté.")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cures.map((cure, idx) => (
              <div key={cure.id}
                className="bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: cure.is_highlight ? "#D4AF37" : "#f3f4f6", boxShadow: cure.is_highlight ? "0 0 0 2px #D4AF37" : undefined }}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={(cure.image ? mediaUrl(cure.image) : null) ?? CURE_FALLBACK_IMG}
                    alt={cure.title ?? ""}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.82) 0%, transparent 55%)" }} />
                  <div className="absolute top-3 left-3">
                    <span style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700,
                      background: cure.is_highlight ? "#D4AF37" : "#0B3D91",
                      color: "white", letterSpacing: "0.06em", borderRadius: 20, padding: "3px 10px"
                    }}>
                      {cure.is_highlight ? "CURÉ ACTUEL" : `N° ${idx + 1}`}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37" }}>{cure.meta}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.35, marginBottom: 8 }}>{cure.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.65 }}>{cure.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex gap-4 flex-wrap">
          <Link to="/paroisse/histoire"
            style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Notre Histoire complète →
          </Link>
          <Link to="/paroisse/equipe"
            style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
            L'équipe actuelle
          </Link>
          <Link to="/paroisse"
            style={{ border: "2px solid #e5e7eb", color: "#6b7280", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:border-gray-400 transition-colors">
            ← La Paroisse
          </Link>
        </div>
      </section>
    </>
  );
}
