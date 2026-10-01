import { Link } from "react-router";
import Icon, { type IconName } from "@/components/Icon";
import { useLang } from "@/lib/i18n";

export default function SeNourrir() {
  const { t } = useLang();

  const SUB_PAGES: { icon: IconName; title: string; desc: string; to: string }[] = [
    { icon: "bookOpen", title: t("nourrir.hub.card.lectures.titre"), desc: t("nourrir.hub.card.lectures.desc"), to: "/lectures" },
    { icon: "books", title: t("nourrir.hub.card.catechese.titre"), desc: t("nourrir.hub.card.catechese.desc"), to: "/se-nourrir/catechese" },
    { icon: "pray", title: t("nourrir.hub.card.priere.titre"), desc: t("nourrir.hub.card.priere.desc"), to: "/se-nourrir/priere" },
    { icon: "newspaper", title: t("nourrir.hub.card.journal.titre"), desc: t("nourrir.hub.card.journal.desc"), to: "/se-nourrir/journal" },
  ];

  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=1400&h=600&fit=crop&auto=format" alt={t("nourrir.hub.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("nourrir.hub.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("nourrir.hub.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("nourrir.hub.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("nourrir.hub.surtitre")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("nourrir.hub.titre2")}</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            {t("nourrir.hub.intro")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SUB_PAGES.map((page) => (
              <Link key={page.to} to={page.to}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                <span style={{ display: "block", marginBottom: 16, color: "#0B3D91" }}><Icon name={page.icon} size={36} /></span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{page.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{page.desc}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}>{t("nourrir.hub.decouvrir")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></span>
              </Link>
            ))}
          </div>

          <div style={{ background: "#0B3D91" }} className="rounded-2xl p-8 mt-12 text-center">
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontStyle: "italic", color: "white", lineHeight: 1.7 }}>
              {t("nourrir.hub.quote")}
            </blockquote>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: 12 }}>{t("nourrir.hub.quoteRef")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
