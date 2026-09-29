import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, mediaUrl } from "@/lib/api";
import { ESPACE_KIND, formatFcfa, type Espace } from "@/lib/content-types";

const font = { fontFamily: "Montserrat, sans-serif" };

const INTRO = {
  chambre: {
    subtitle: "Séjournez au calme, au cœur de la paroisse",
    heading: "Nos chambres",
    text: "Le centre d'accueil de la paroisse reçoit les pèlerins, retraitants, familles de passage et délégations. Choisissez votre chambre, vos dates, et réservez en ligne en payant par Orange Money, MTN MoMo ou au secrétariat.",
    hero: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&h=500&fit=crop&auto=format",
  },
  salle: {
    subtitle: "Des espaces pour vos événements, réunions et célébrations",
    heading: "Nos salles",
    text: "Mariages, baptêmes, réceptions, conférences, séminaires ou réunions de mouvements : la paroisse met ses salles à disposition. Vérifiez la disponibilité, réservez et payez en ligne, ou demandez un devis.",
    hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&h=500&fit=crop&auto=format",
  },
};

export default function Espaces({ kind }: { kind: Espace["kind"] }) {
  const [items, setItems] = useState<Espace[] | null>(null);
  const meta = ESPACE_KIND[kind];
  const intro = INTRO[kind];
  const other = kind === "chambre" ? ESPACE_KIND.salle : ESPACE_KIND.chambre;

  useEffect(() => {
    setItems(null);
    apiGet<Espace[]>(`/espaces?kind=${kind}`).then(setItems).catch(() => setItems([]));
  }, [kind]);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src={intro.hero} alt={meta.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale" style={{ ...font, fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Vie paroissiale</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ ...font, fontSize: "0.72rem", color: "#D4AF37" }}>{meta.title}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{meta.title}</h1>
          <p style={{ ...font, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{intro.subtitle}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ ...font, fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">RÉSERVATION EN LIGNE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{intro.heading}</h2>
          <p style={{ ...font, fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7, maxWidth: 760 }}>{intro.text}</p>

          {items === null ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#9ca3af" }}>Chargement…</p>
          ) : items.length === 0 ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#6b7280" }}>
              Aucune {meta.item} n'est proposée à la réservation pour le moment. Contactez le secrétariat paroissial.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((e) => {
                const photo = mediaUrl(e.photos?.[0]);
                return (
                  <Link key={e.id} to={`${meta.path}/${e.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all flex flex-col">
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {photo ? <img src={photo} alt={e.nom} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl">{kind === "chambre" ? "🛏️" : "🏛️"}</div>}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>{e.nom}</h3>
                      {e.resume && <p style={{ ...font, fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6, marginTop: 6 }}>{e.resume}</p>}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {e.capacite && (
                          <span className="bg-blue-50 rounded-full px-3 py-1" style={{ ...font, fontSize: "0.7rem", fontWeight: 600, color: "#0B3D91" }}>
                            👥 {e.capacite} pers.
                          </span>
                        )}
                        {kind === "chambre" && e.quantite > 1 && (
                          <span className="bg-blue-50 rounded-full px-3 py-1" style={{ ...font, fontSize: "0.7rem", fontWeight: 600, color: "#0B3D91" }}>
                            {e.quantite} chambres
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-4 flex items-end justify-between gap-2">
                        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", fontWeight: 700, color: "#0B3D91" }}>
                          {e.prix ? <>{formatFcfa(e.prix)}<span style={{ ...font, fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}> / {meta.unit}</span></> : "Sur devis"}
                        </span>
                        <span style={{ ...font, fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37" }}>Réserver →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p style={{ ...font, fontSize: "0.85rem", color: "#374151" }}>
              {kind === "chambre" ? "Vous organisez un événement ?" : "Besoin d'un hébergement pour vos invités ?"} Découvrez aussi notre {other.title.toLowerCase()}.
            </p>
            <Link to={other.path} style={{ background: "#0B3D91", ...font, fontWeight: 700, fontSize: "0.8rem" }}
              className="text-white px-5 py-2.5 rounded-full hover:opacity-90 whitespace-nowrap">{other.title} →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
