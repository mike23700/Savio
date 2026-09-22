import { Link } from "react-router";

const SUB_PAGES = [
  { icon: "🌱", title: "Genèse", desc: "Les origines de notre paroisse en 1961, la vision des fondateurs et les premiers pas de notre communauté.", to: "/paroisse/genese" },
  { icon: "📜", title: "Notre Histoire", desc: "Dates clés, succession des curés, consécration de l'église et extension vers Youpwè.", to: "/paroisse/histoire" },
  { icon: "✨", title: "Saint Dominique Savio", desc: "Découvrez notre saint patron, jeune saint salésien canonisé en 1954, modèle pour la jeunesse.", to: "/paroisse/savio" },
  { icon: "👨‍⚕️", title: "Le Curé & l'équipe", desc: "Rencontrez nos prêtres : Abbé Mbanda, Abbé Nwind, Abbé Saïdou et Abbé Mohomye.", to: "/paroisse/equipe" },
  { icon: "🏛️", title: "Organisation", desc: "Structure pastorale, conseil économique, CEV et chiffres clés de notre communauté.", to: "/paroisse/organisation" },
  { icon: "⛪", title: "Archidiocèse", desc: "Notre appartenance à l'Archidiocèse de Douala, Doyenné Wouri I et la CENC.", to: "/paroisse/archidiocese" },
  { icon: "🖼️", title: "Médiathèque", desc: "Photos et vidéos de la vie paroissiale, célébrations et moments communautaires.", to: "/paroisse/mediatheque" },
];

export default function LaParoisse() {
  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=600&fit=crop&auto=format" alt="La Paroisse" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>La Paroisse</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>La Paroisse</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Une communauté vivante, unie dans la foi, au service de Dieu et de nos frères.</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">EXPLORER</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Tout sur notre paroisse</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            Découvrez l'histoire, l'équipe, l'organisation et les ressources de la Paroisse Saint Dominique Savio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUB_PAGES.map((page) => (
              <Link key={page.to} to={page.to}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 16 }}>{page.icon}</span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{page.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{page.desc}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}>Découvrir →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
