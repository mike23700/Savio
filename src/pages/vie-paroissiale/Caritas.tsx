import { useEffect, useState } from "react";
import { Link } from "react-router";
import { mediaUrl } from "@/lib/api";
import { blocksOf, extraOf, loadPage, type PageContent } from "@/lib/pages";

export default function Caritas() {
  const [page, setPage] = useState<PageContent | null>(null);
  const cards = blocksOf(page, "card");
  const extra = extraOf(page);

  useEffect(() => {
    loadPage("caritas").then(setPage).catch(() => setPage(null));
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src={(page?.hero_image ? mediaUrl(page.hero_image) : null) ?? "https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format"}
          alt={page?.title ?? "Caritas"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Vie Paroissiale</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{page?.title ?? "Caritas"}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{page?.title ?? "Caritas Paroissiale"}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{page?.subtitle ?? "Au service des plus démunis"}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">
            {String(extra.section_label ?? "SOLIDARITÉ")}
          </div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>
            {String(extra.section_title ?? "Notre mission Caritas")}
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 40, maxWidth: 640 }}>
            {String(extra.section_intro ?? "La Caritas paroissiale est le bras charitable de notre communauté.")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {cards.map((action) => (
              <div key={action.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all">
                <span style={{ fontSize: "2rem", display: "block", marginBottom: 12 }}>{action.icon}</span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{action.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7 }}>{action.description}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#0B3D91" }} className="rounded-2xl p-8 text-center">
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: 8 }}>
              {String(extra.cta_title ?? "Soutenir la Caritas")}
            </h3>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 20 }}>
              {String(extra.cta_text ?? "Votre don permet à notre Caritas de continuer à agir au service des plus pauvres. Chaque geste compte.")}
            </p>
            <Link to="/don"
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              ❤️ Faire un don
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
