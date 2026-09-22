import { Link } from "react-router";

const SUB_PAGES = [
  { icon: "📚", title: "Catéchèse", desc: "Formation dans la foi pour tous les âges : éveil à la foi, 1ère, 2e, 3e année, préparation au mariage.", to: "/se-nourrir/catechese" },
  { icon: "🙏", title: "Prière & Méditation", desc: "Adoration eucharistique, chapelet, adoration nocturne, groupes de prière et Lectio Divina.", to: "/se-nourrir/priere" },
  { icon: "📰", title: "Journal paroissial", desc: "La Voix de Dominique Savio : lectures du jour, annonces, résumé des quêtes. Abonnement dès 500 FCFA/mois.", to: "/se-nourrir/journal" },
];

export default function SeNourrir() {
  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591012925-76dd1f406bd1?w=1400&h=600&fit=crop&auto=format" alt="Se Nourrir" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Se Nourrir</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Se Nourrir</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Formation, prière et ressources pour votre croissance spirituelle</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">FORMATION</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Grandir dans la foi</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            Ressources spirituelles, formations et publications pour nourrir votre vie intérieure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUB_PAGES.map((page) => (
              <Link key={page.to} to={page.to}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
                <span style={{ fontSize: "2.8rem", display: "block", marginBottom: 16 }}>{page.icon}</span>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>{page.title}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{page.desc}</p>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}>Découvrir →</span>
              </Link>
            ))}
          </div>

          <div style={{ background: "#0B3D91" }} className="rounded-2xl p-8 mt-12 text-center">
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontStyle: "italic", color: "white", lineHeight: 1.7 }}>
              "Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés."
            </blockquote>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: 12 }}>— Matthieu 5,6</p>
          </div>
        </div>
      </section>
    </>
  );
}
