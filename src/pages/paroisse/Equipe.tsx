import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, mediaUrl } from "@/lib/api";
import type { TeamMember } from "@/lib/content-types";

export default function Equipe() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    apiGet<TeamMember[]>("/equipe").then(setTeam).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=1400&h=600&fit=crop&auto=format"
          alt="Notre équipe pastorale"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Le Curé & l'équipe</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Le Curé & l'équipe pastorale</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Les prêtres au service de notre communauté</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">NOTRE ÉQUIPE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Les prêtres de la paroisse</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 48, lineHeight: 1.7 }}>
            Une équipe pastorale unie dans le service de Dieu et de notre communauté paroissiale.
          </p>

          <div className="space-y-8">
            {team.map((priest, idx) => (
              <div key={priest.id} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 bg-white">
                <div className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>

                  {/* Photo — full height */}
                  <div className="relative md:w-2/5 min-h-[320px] md:min-h-[360px] overflow-hidden">
                    <img
                      src={mediaUrl(priest.photo) ?? undefined}
                      alt={priest.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.72) 0%, transparent 55%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.66rem", fontWeight: 700, background: "#D4AF37", color: "white", letterSpacing: "0.08em" }}
                        className="inline-block px-3 py-1 rounded-full mb-2">
                        {priest.role.toUpperCase()}
                      </span>
                      {priest.since && (
                        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.72)" }}>
                          En poste depuis {priest.since}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description — right side */}
                  <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.05rem, 2.5vw, 1.35rem)", fontWeight: 700, color: "#1c2340", lineHeight: 1.3, marginBottom: 4 }}>
                      {priest.name}
                    </h3>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#9ca3af", marginBottom: 16 }}>
                      {priest.origin}
                    </div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.84rem", color: "#4b5563", lineHeight: 1.85, marginBottom: 20 }}>
                      {priest.bio}
                    </p>
                    {priest.motto && (
                      <blockquote style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "0.88rem", color: "#0B3D91", borderLeft: "3px solid #D4AF37", paddingLeft: 14, marginBottom: 24, lineHeight: 1.6 }}>
                        "{priest.motto}"
                      </blockquote>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/paroisse/equipe/${priest.slug}`}
                        style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}
                        className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                        Voir le profil complet →
                      </Link>
                      {priest.email && <a
                        href={`mailto:${priest.email}`}
                        style={{ border: "1.5px solid #e5e7eb", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#6b7280" }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full hover:border-blue-300 hover:text-blue-700 transition-colors">
                        ✉ Contacter
                      </a>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Contacter la paroisse</h3>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginBottom: 20, lineHeight: 1.7 }}>
              Pour toute demande pastorale, vous pouvez contacter le secrétariat ou nous écrire directement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact"
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                📞 Nous contacter
              </Link>
              <Link to="/celebrer/intention"
                style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
                🙏 Demander une intention de messe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
