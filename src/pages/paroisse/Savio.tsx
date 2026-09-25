import { useEffect, useState } from "react";
import { Link } from "react-router";
import { mediaUrl } from "@/lib/api";
import { blocksOf, extraOf, introParagraphs, loadPage, renderInline, type PageContent } from "@/lib/pages";

export default function Savio() {
  const [page, setPage] = useState<PageContent | null>(null);
  const bullets = blocksOf(page, "bullet");
  const extra = extraOf(page);
  const paragraphs = introParagraphs(page?.intro ?? null);
  const bio = Array.isArray(extra.bio) ? (extra.bio as [string, string][]) : [];
  const bioImage = (typeof extra.bio_image === "string" ? extra.bio_image : "") || "https://backoffice.paroissesaintdominiquesavio.com/assets/09633277-f72b-4102-9fe8-3752e3acd3ee";

  useEffect(() => {
    loadPage("savio").then(setPage).catch(() => setPage(null));
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img
          src={(page?.hero_image ? mediaUrl(page.hero_image) : null) ?? "https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=600&fit=crop&auto=format"}
          alt={page?.title ?? "Saint Dominique Savio"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{page?.title ?? "Saint Dominique Savio"}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{page?.title ?? "Saint Dominique Savio"}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{page?.subtitle ?? "Notre saint patron, modèle de jeunesse et de foi"}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={bioImage}
                  alt="Saint Dominique Savio"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1763517789508-f23012039417?w=600&h=500&fit=crop&auto=format";
                  }}
                />
              </div>
              {bio.length > 0 && (
                <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 12 }}>
                    {String(extra.bio_label ?? "REPÈRES BIOGRAPHIQUES")}
                  </div>
                  {bio.map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-blue-100 last:border-0">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280" }}>{label}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#0B3D91" }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">
                {String(extra.section_label ?? "NOTRE SAINT PATRON")}
              </div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>
                {String(extra.section_title ?? "La vie de Dominique Savio")}
              </h2>

              {paragraphs.length > 0 && (
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.85 }} className="space-y-4">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{renderInline(p)}</p>
                  ))}
                </div>
              )}

              {extra.quote && (
                <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#0B3D91", borderLeft: "4px solid #D4AF37", paddingLeft: "1.2rem", margin: "1.5rem 0" }}>
                  "{String(extra.quote)}"
                  <footer style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontStyle: "normal", color: "#6b7280", marginTop: 8 }}>{String(extra.quote_author ?? "")}</footer>
                </blockquote>
              )}

              {bullets.length > 0 && (
                <div style={{ background: "#F5F7FA", borderRadius: 16, padding: "20px 24px" }} className="mt-4">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 10 }}>
                    {String(extra.spirituality_label ?? "SPIRITUALITÉ DE DOMINIQUE SAVIO")}
                  </div>
                  {bullets.map((b) => (
                    <div key={b.id} className="flex items-start gap-2 mb-2">
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0B3D91", flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563", lineHeight: 1.6 }}>{b.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {extra.prayer && (
        <section style={{ background: "#0B3D91" }} className="py-14 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">PRIÈRE</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: 700, color: "white" }}>
              {String(extra.prayer_title ?? "Prière à Saint Dominique Savio")}
            </h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginTop: 16, lineHeight: 1.8, fontStyle: "italic" }}>
              {String(extra.prayer)}
            </p>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontStyle: "italic", color: "#D4AF37", marginTop: 16 }}>Amen.</p>
            <Link to="/paroisse/equipe"
              style={{ border: "2px solid white", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full mt-8 hover:bg-white/10 transition-colors">
              Découvrir notre équipe →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
