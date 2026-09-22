import { Link } from "react-router";

export default function Organisation() {
  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format" alt="Organisation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Organisation</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Organisation de la paroisse</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Structure pastorale et gouvernance</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Structure pastorale</h3>
              {[
                "Conseil pastoral paroissial",
                "Conseil économique paroissial",
                "Communautés Ecclésiales Vivantes (CEV)",
                "Équipes pastorales spécialisées",
                "Mouvements et associations de laïcs",
                "Service de la catéchèse",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", flexShrink: 0 }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563" }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Chiffres clés</h3>
              {[
                { num: "1961", label: "Année de fondation" },
                { num: "65+", label: "Années d'histoire" },
                { num: "7", label: "Paroisses du Doyenné Wouri I" },
                { num: "4", label: "Messes dominicales" },
                { num: "8", label: "Mouvements & associations" },
                { num: "∞", label: "Communauté ouverte à tous" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#4b5563" }}>{item.label}</span>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#0B3D91" }}>{item.num}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#F5F7FA", borderRadius: 20, padding: 32 }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>Organigramme pastoral</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: "⛪", title: "Le Curé", desc: "Responsable pastoral et administratif de la paroisse" },
                { icon: "👨‍💼", title: "Les Vicaires", desc: "Assistants du curé pour les célébrations et l'accompagnement" },
                { icon: "👥", title: "Conseil pastoral", desc: "Représentants laïcs, examine les besoins d'évangélisation" },
                { icon: "💰", title: "Conseil économique", desc: "Gestion des biens et finances paroissiaux" },
                { icon: "🏘️", title: "CEV", desc: "Communautés Ecclésiales Vivantes dans les quartiers" },
                { icon: "📚", title: "Catéchèse", desc: "Formation des enfants, jeunes et adultes dans la foi" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all">
                  <span style={{ fontSize: "1.8rem", display: "block", marginBottom: 10 }}>{item.icon}</span>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", marginBottom: 6, fontSize: "0.95rem" }}>{item.title}</h4>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
