import { Link } from "react-router";
import Icon, { type IconName } from "@/components/Icon";
import { useLang } from "@/lib/i18n";

function subPages(t: (key: string) => string): { icon: IconName; title: string; desc: string; to: string }[] {
  return [
    { icon: "hand", title: t("vie.mouvements.titre"), desc: t("vie.mouvements.desc"), to: "/vie-paroissiale/mouvements" },
    { icon: "heart", title: t("vie.caritas.titre"), desc: t("vie.caritas.desc"), to: "/vie-paroissiale/caritas" },
    { icon: "hammer", title: t("vie.projets.titre"), desc: t("vie.projets.desc"), to: "/vie-paroissiale/projets" },
    { icon: "clipboard", title: t("vie.registre.titre"), desc: t("vie.registre.desc"), to: "/vie-paroissiale/registre" },
    { icon: "bed", title: t("vie.centreAccueil.titre"), desc: t("vie.centreAccueil.desc"), to: "/centre-accueil" },
    { icon: "landmark", title: t("vie.salles.titre"), desc: t("vie.salles.desc"), to: "/location-salles" },
  ];
}

export default function VieParoissiale() {
  const { t } = useLang();
  const SUB_PAGES = subPages(t);

  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=600&fit=crop&auto=format" alt={t("vie.alt")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("vie.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("vie.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("vie.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("vie.kicker.communaute")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("vie.communaute.titre")}</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            {t("vie.communaute.intro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SUB_PAGES.map((page) => (
              <Link key={page.to} to={page.to}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                <span style={{ display: "block", marginBottom: 16, color: "#0B3D91" }}><Icon name={page.icon} size={32} /></span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{page.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{page.desc}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}>{t("vie.voir")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
