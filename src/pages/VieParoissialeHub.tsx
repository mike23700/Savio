import { Link } from "react-router";

const SUB_PAGES = [
  { icon: "✋", title: "Mouvements & Groupes", desc: "Conseils paroissiaux, mouvements adultes et jeunes, chorales et Communautés Ecclésiales Vivantes.", to: "/vie-paroissiale/mouvements" },
  { icon: "❤️", title: "Caritas", desc: "Actions de solidarité et d'entraide : rentrée scolaire, aide alimentaire, santé et insertion.", to: "/vie-paroissiale/caritas" },
  { icon: "🔨", title: "Projets", desc: "Rénovation de l'église, construction de salles, forage d'eau et autres projets communautaires.", to: "/vie-paroissiale/projets" },
  { icon: "📋", title: "Registre paroissial", desc: "Inscrivez-vous officiellement à notre communauté, rejoignez une CEV ou un groupe.", to: "/vie-paroissiale/registre" },
];

export default function VieParoissialeHub() {
  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=600&fit=crop&auto=format" alt="Vie Paroissiale" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Vie Paroissiale</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Vie Paroissiale</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Engagés ensemble dans la mission de l'Église</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">COMMUNAUTÉ</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Notre vie communautaire</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            Découvrez les différentes façons de vous impliquer dans la vie de notre paroisse.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SUB_PAGES.map((page) => (
              <Link key={page.to} to={page.to}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 16 }}>{page.icon}</span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{page.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{page.desc}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}>Découvrir →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
