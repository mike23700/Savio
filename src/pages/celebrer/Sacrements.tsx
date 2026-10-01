import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, mediaUrl } from "@/lib/api";
import Icon from "@/components/Icon";
import { useLang } from "@/lib/i18n";

interface Sacrement {
  id: number;
  slug: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  img: string;
}

function SacrementCard({ s }: { s: Sacrement }) {
  const { t } = useLang();
  return (
    <Link to={`/celebrer/sacrements/${s.slug}`} className="text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-transparent hover:border-yellow-200 block">
      <div className="relative h-40 overflow-hidden">
        <img src={mediaUrl(s.img) ?? undefined} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.85) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
          <span className="text-2xl">{s.icon}</span>
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", fontWeight: 700, color: "white" }}>{s.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>{s.description}</p>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700 }}>{t("celebrer.sacrements.enSavoirPlus")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></span>
      </div>
    </Link>
  );
}

export default function Sacrements() {
  const { t } = useLang();
  const [sacrements, setSacrements] = useState<Sacrement[]>([]);

  useEffect(() => {
    apiGet<Sacrement[]>("/sacrements").then(setSacrements).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format" alt={t("celebrer.sacrements.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("celebrer.hub.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("celebrer.sacrements.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("celebrer.sacrements.titrePage")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("celebrer.sacrements.sousTitre")}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("celebrer.sacrements.surtitre")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{t("celebrer.sacrements.titre2")}</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 32 }}>
            {t("celebrer.sacrements.intro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sacrements.map((s) => <SacrementCard key={s.id} s={s} />)}
          </div>
        </div>
      </section>
    </>
  );
}