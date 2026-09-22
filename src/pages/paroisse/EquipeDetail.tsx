import { Link, useParams } from "react-router";
import { TEAM } from "@/data/content";

export default function EquipeDetail() {
  const { id } = useParams<{ id: string }>();
  const priest = TEAM.find((p) => p.id === id);

  if (!priest) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">⛪</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>Profil introuvable</h1>
        <Link to="/paroisse/equipe"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          ← Retour à l'équipe
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format" alt={priest.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse/equipe" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>L'équipe</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{priest.name.split(" ").slice(-1)[0]}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}>{priest.name}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "#D4AF37", fontSize: "0.9rem", marginTop: 4, fontWeight: 700 }}>{priest.role}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={priest.photo}
                  alt={priest.name}
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=400&h=500&fit=crop&auto=format";
                  }}
                />
              </div>

              <div style={{ background: "#F5F7FA", borderRadius: 16, padding: "20px", marginTop: 20 }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 12 }}>INFORMATIONS</div>
                {[
                  priest.born && ["Né le", priest.born],
                  priest.ordained && ["Ordonné le", priest.ordained],
                  priest.ordainedBy && ["Ordonné par", priest.ordainedBy],
                ].filter(Boolean).map((item) => {
                  const [label, value] = item as [string, string];
                  return (
                    <div key={label} className="flex flex-col py-2.5 border-b border-gray-100 last:border-0">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#9ca3af" }}>{label}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 700, color: "#1c2340", marginTop: 2 }}>{value}</span>
                    </div>
                  );
                })}
              </div>

              {priest.motto && (
                <div style={{ background: "#E8F2FF", borderRadius: 16, padding: "20px", marginTop: 16, borderLeft: "4px solid #D4AF37" }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 8 }}>DEVISE</div>
                  <p style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "0.95rem", color: "#0B3D91", lineHeight: 1.6 }}>
                    "{priest.motto}"
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">BIOGRAPHIE</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Formation et parcours</h2>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.85 }}>{priest.bio}</p>

              <div style={{ marginTop: 40 }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em", marginBottom: 16 }}>MINISTÈRES EXERCÉS</div>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100" />
                  <div className="space-y-5">
                    {priest.ministries.map((ministry, i) => (
                      <div key={i} className="flex gap-5 items-start">
                        <div style={{ width: 32, height: 32, background: i === priest.ministries.length - 1 ? "#D4AF37" : "#0B3D91", borderRadius: "50%", flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 700 }}>{i + 1}</span>
                        </div>
                        <div style={{ background: i === priest.ministries.length - 1 ? "#E8F2FF" : "#F5F7FA", borderRadius: 12, padding: "12px 16px", flex: 1, border: i === priest.ministries.length - 1 ? "1px solid #0B3D91" : "1px solid transparent" }}>
                          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#374151", lineHeight: 1.5, fontWeight: i === priest.ministries.length - 1 ? 700 : 400 }}>{ministry}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10 flex-wrap">
            <Link to="/paroisse/equipe"
              style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
              ← Retour à l'équipe
            </Link>
            <Link to="/contact"
              style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Nous contacter →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
