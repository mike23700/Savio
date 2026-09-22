import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";

interface Sacrement {
  id: number;
  slug: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  img: string;
}

function SacrementCard({ s }: { s: Sacrement }) {
  return (
    <Link to={`/celebrer/sacrements/${s.slug}`} className="text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-transparent hover:border-yellow-200 block">
      <div className="relative h-40 overflow-hidden">
        <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.85) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
          <span className="text-2xl">{s.icon}</span>
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", fontWeight: 700, color: "white" }}>{s.title}</h3>
        </div>
      </div>
      <div className="p-5">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>{s.description}</p>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700 }}>En savoir plus →</span>
      </div>
    </Link>
  );
}

export default function Sacrements() {
  const [sacrements, setSacrements] = useState<Sacrement[]>([]);

  useEffect(() => {
    apiGet<Sacrement[]>("/sacrements").then(setSacrements).catch(() => {});
  }, []);

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format" alt="Sacrements" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Célébrer</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Sacrements</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Les Sacrements</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Les signes efficaces de la grâce de Dieu</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">SACREMENTS DE L'ÉGLISE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>Les sept sacrements</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 32 }}>
            Les sacrements sont des signes efficaces de la grâce de Dieu. Cliquez sur un sacrement pour en savoir plus.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sacrements.map((s) => <SacrementCard key={s.id} s={s} />)}
          </div>
        </div>
      </section>
    </>
  );
}
