import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, mediaUrl } from "@/lib/api";
import { ESPACE_KIND, type Espace } from "@/lib/content-types";
import { useLang } from "@/lib/i18n";
import Icon from "@/components/Icon";

const font = { fontFamily: "Montserrat, sans-serif" };

const HERO_IMAGES: Record<Espace["kind"], string> = {
  chambre: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&h=500&fit=crop&auto=format",
  salle: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&h=500&fit=crop&auto=format",
};

export default function Espaces({ kind }: { kind: Espace["kind"] }) {
  const [items, setItems] = useState<Espace[] | null>(null);
  const { t, lang } = useLang();
  const meta = ESPACE_KIND[kind];
  const isRoom = kind === "chambre";
  const intro = {
    hero: HERO_IMAGES[kind],
    subtitle: t(isRoom ? "top.espaces.chambreSousTitre" : "top.espaces.salleSousTitre"),
    heading: t(isRoom ? "top.espaces.chambreTitre" : "top.espaces.salleTitre"),
    text: t(isRoom ? "top.espaces.chambreTexte" : "top.espaces.salleTexte"),
  };
  const other = kind === "chambre" ? ESPACE_KIND.salle : ESPACE_KIND.chambre;
  const locale = lang === "en" ? "en-GB" : "fr-FR";
  const sectionTitle = isRoom ? t("top.espaces.centreAccueil") : t("top.espaces.locationSalles");
  const otherTitle = isRoom ? t("top.espaces.locationSalles") : t("top.espaces.centreAccueil");
  const itemLabel = isRoom ? t("top.espaces.itemChambre") : t("top.espaces.itemSalle");
  const unitLabel = isRoom ? t("top.espaces.nuit") : t("top.espaces.jour");
  const fmtFcfa = (n: number) => `${n.toLocaleString(locale)} FCFA`;

  useEffect(() => {
    setItems(null);
    apiGet<Espace[]>(`/espaces?kind=${kind}`).then(setItems).catch(() => setItems([]));
  }, [kind]);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src={intro.hero} alt={sectionTitle} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.common.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/vie-paroissiale" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.espaces.vieParoissiale")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ ...font, fontSize: "0.72rem", color: "#D4AF37" }}>{sectionTitle}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{sectionTitle}</h1>
          <p style={{ ...font, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{intro.subtitle}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ ...font, fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("top.espaces.surtitre")}</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{intro.heading}</h2>
          <p style={{ ...font, fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7, maxWidth: 760 }}>{intro.text}</p>

          {items === null ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#9ca3af" }}>{t("top.common.chargement")}</p>
          ) : items.length === 0 ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#6b7280" }}>
              {t("top.espaces.aucun").replace("{item}", itemLabel)}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((e) => {
                const photo = mediaUrl(e.photos?.[0]);
                return (
                  <Link key={e.id} to={`${meta.path}/${e.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all flex flex-col">
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {photo ? <img src={photo} alt={e.nom} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl"><Icon name={kind === "chambre" ? "bed" : "landmark"} size={48} /></div>}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>{e.nom}</h3>
                      {e.resume && <p style={{ ...font, fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6, marginTop: 6 }}>{e.resume}</p>}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {e.capacite && (
                          <span className="bg-blue-50 rounded-full px-3 py-1" style={{ ...font, fontSize: "0.7rem", fontWeight: 600, color: "#0B3D91" }}>
                            <Icon name="users" size={14} strokeWidth={1.75} /> {t("top.espaces.capacite").replace("{n}", String(e.capacite))}
                          </span>
                        )}
                        {kind === "chambre" && e.quantite > 1 && (
                          <span className="bg-blue-50 rounded-full px-3 py-1" style={{ ...font, fontSize: "0.7rem", fontWeight: 600, color: "#0B3D91" }}>
                            {t("top.espaces.chambres").replace("{n}", String(e.quantite))}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-4 flex items-end justify-between gap-2">
                        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", fontWeight: 700, color: "#0B3D91" }}>
                          {e.prix ? <>{fmtFcfa(e.prix)}<span style={{ ...font, fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}> / {unitLabel}</span></> : t("top.common.surDevis")}
                        </span>
                        <span style={{ ...font, fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37" }}>{t("top.espaces.reserver")} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p style={{ ...font, fontSize: "0.85rem", color: "#374151" }}>
              {isRoom ? t("top.espaces.autreQuestion") : t("top.espaces.autreHebergement")} {t("top.espaces.decouvrirAutre").replace("{titre}", otherTitle.toLowerCase())}
            </p>
            <Link to={other.path} style={{ background: "#0B3D91", ...font, fontWeight: 700, fontSize: "0.8rem" }}
              className="text-white px-5 py-2.5 rounded-full hover:opacity-90 whitespace-nowrap">{otherTitle} <Icon name="arrowRight" size={14} strokeWidth={1.75} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
