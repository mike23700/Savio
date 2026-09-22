import { Link } from "react-router";

const SUB_PAGES = [
  { icon: "⛪", title: "Horaires des messes", desc: "Messes quotidiennes, dominicales, des malades et célébrations spéciales avec lectures du jour.", to: "/celebrer/messes" },
  { icon: "✝️", title: "Sacrements", desc: "Baptême, mariage, confirmation, eucharistie, réconciliation et onction des malades.", to: "/celebrer/sacrements" },
  { icon: "🙏", title: "Intention de messe", desc: "Faites célébrer une messe pour vos intentions : défunts, malades, action de grâce. (3 000 FCFA)", to: "/celebrer/intention" },
  { icon: "💍", title: "Publication des bans", desc: "Préparez votre mariage à l'Église. Documents requis et formulaire de demande.", to: "/celebrer/bans" },
  { icon: "🎙️", title: "Homélies", desc: "Écoutez ou relisez les homélies du Père Curé et de l'équipe pastorale.", to: "/homelies" },
  { icon: "📅", title: "Agenda liturgique", desc: "Calendrier des célébrations, fêtes, événements et temps forts de l'année liturgique.", to: "/agenda" },
];

export default function CelebrerHub() {
  return (
    <>
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=600&fit=crop&auto=format" alt="Célébrer" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Célébrer</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Célébrer</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Les sacrements et célébrations de notre communauté</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">LITURGIE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Tout pour célébrer</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 40, lineHeight: 1.7 }}>
            Messes, sacrements, intentions et ressources liturgiques pour nourrir votre foi.
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
