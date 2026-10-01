import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";
import Icon, { type IconName } from "@/components/Icon";
import { useLang } from "@/lib/i18n";

type Tab = "conseil" | "mouvement" | "chorale" | "cev";

interface MouvementItem {
  id: number;
  slug: string;
  icon: string;
  title: string;
  description: string;
  color: string | null;
}

function tabMeta(t: (key: string) => string): Record<Tab, { icon: IconName; label: string; kicker: string; heading: string; intro?: string }> {
  return {
    conseil: { icon: "landmark", label: t("vie.mouv.tabs.conseil.label"), kicker: t("vie.mouv.tabs.conseil.kicker"), heading: t("vie.mouv.tabs.conseil.heading") },
    mouvement: { icon: "hand", label: t("vie.mouv.tabs.mouvement.label"), kicker: t("vie.mouv.tabs.mouvement.kicker"), heading: t("vie.mouv.tabs.mouvement.heading") },
    chorale: { icon: "music", label: t("vie.mouv.tabs.chorale.label"), kicker: t("vie.mouv.tabs.chorale.kicker"), heading: t("vie.mouv.tabs.chorale.heading") },
    cev: {
      icon: "home", label: t("vie.mouv.tabs.cev.label"), kicker: t("vie.mouv.tabs.cev.kicker"), heading: t("vie.mouv.tabs.cev.heading"),
      intro: t("vie.mouv.tabs.cev.intro"),
    },
  };
}

export default function Mouvements() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("conseil");
  const [items, setItems] = useState<MouvementItem[]>([]);

  useEffect(() => {
    apiGet<MouvementItem[]>(`/mouvements?category=${tab}`).then(setItems).catch(() => setItems([]));
  }, [tab]);

  const TAB_META = tabMeta(t);
  const tabs: { id: Tab; icon: IconName; label: string }[] = [
    { id: "conseil", icon: TAB_META.conseil.icon, label: TAB_META.conseil.label },
    { id: "mouvement", icon: TAB_META.mouvement.icon, label: TAB_META.mouvement.label },
    { id: "chorale", icon: TAB_META.chorale.icon, label: TAB_META.chorale.label },
    { id: "cev", icon: TAB_META.cev.icon, label: TAB_META.cev.label },
  ];
  const meta = TAB_META[tab];

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format" alt={t("vie.mouvements.titre")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("nav.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("vie.titre")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("vie.mouvements.titre")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("vie.mouvements.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{t("vie.mouv.sousTitre")}</p>
        </div>
      </div>

      <section style={{ background: "#F5F7FA" }} className="px-4 py-6 sticky top-[73px] z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, background: tab === t.id ? "#0B3D91" : "white", color: tab === t.id ? "white" : "#374151", border: tab === t.id ? "1px solid #0B3D91" : "1px solid #e5e7eb" }}
              className="px-5 py-2.5 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-all">
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{meta.kicker}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: meta.intro ? 12 : 32 }}>{meta.heading}</h2>
          {meta.intro && (
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 32 }}>{meta.intro}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link key={item.id} to={`/vie-paroissiale/mouvements/${item.slug}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all flex gap-5">
                <div style={{ width: 56, height: 56, background: item.color === "#0B3D91" ? "#E8F2FF" : "#FDF8E7", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7 }}>{item.description}</p>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700, display: "inline-block", marginTop: 8 }}>{t("vie.mouv.enSavoirPlus")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></span>
                </div>
              </Link>
            ))}
          </div>

          {tab === "cev" && (
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center mt-8">
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#374151", lineHeight: 1.7 }}>
                {t("vie.mouv.cev.texte")}
              </p>
              <Link to="/vie-paroissiale/registre"
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full mt-4 hover:opacity-90 transition-opacity">
                {t("vie.mouv.cev.bouton")}<Icon name="arrowRight" size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
