import { Link } from "react-router";

function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
      <img src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=600&fit=crop&auto=format" alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
      <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
          <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{title}</span>
        </div>
        <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

const DATES_CLES = [
  { date: "4 déc. 1961", event: "Achat du terrain", desc: "Père Alexis Derrien achète 3 000 m² à New-Bell Bonadoumbé." },
  { date: "~1962-63", event: "Lieu de culte établi", desc: "Mgr Thomas Mongo et Abbé Robert Lépine établissent un premier lieu de culte." },
  { date: "1964-1966", event: "Premières communautés", desc: "Père Lépine construit l'église, lance les premières communautés chrétiennes." },
  { date: "1974", event: "Érection canonique", desc: "Érection canonique par Mgr Simon Tonye." },
  { date: "~1988-1996", event: "Succession de curés", desc: "Abbé Babe → Abbé Epea Simon (1990) → Abbé Bonaventure Taa (1996)." },
  { date: "6 mai 2000", event: "Consécration de l'église", desc: "Consécration de l'église par le Cardinal Christian Tumi." },
  { date: "Après 2000", event: "Construction du presbytère", desc: "Construction du presbytère à deux niveaux." },
  { date: "Juillet 2015", event: "Naissance de Youpwè", desc: "Naissance de la paroisse de Youpwè (Saint Ignace d'Antioche)." },
  { date: "2016-2018", event: "Développement", desc: "Bâtiment catéchèse, salle mouvements, forage d'eau." },
  { date: "~2019-2020", event: "Rénovations", desc: "Toiture grotte mariale, rénovation sacristie." },
  { date: "8 oct. 2021", event: "Visite apostolique", desc: "Visite du Nonce Apostolique Mgr Julio Murat." },
];

const YOUPWE_DATES = [
  { date: "1996", event: "Conception", desc: "Conception du projet d'extension par le Père EPEA." },
  { date: "Fév. 1997", event: "Opérationnel", desc: "Opérationnel sous l'Abbé Bonaventure TAA." },
  { date: "Carême 1998", event: "Première Eucharistie", desc: "Première Eucharistie chez M. NOUNG Georges, puis grotte du patriarche MBOUCK Guillaume (mai 1998)." },
  { date: "Déc. 1998", event: "Catéchèse lancée", desc: "Catéchèse lancée par Mme MBOUCK Marie Thérèse et une sœur Spiritaine." },
  { date: "1999", event: "Communauté anglophone", desc: "La communauté anglophone intègre le mouvement." },
  { date: "Août 2001", event: "Financement terrain", desc: "Visite honorable DOOH Collins → financement terrain et chapelle." },
  { date: "Janv. 2005", event: "Premières messes", desc: "Premières messes dans la chapelle de Youpwè." },
  { date: "2007", event: "Communautés CEV", desc: "6 CEVs créées dans le secteur de Youpwè." },
  { date: "13 juillet 2015", event: "Érection en paroisse", desc: "Youpwè érigée en paroisse autonome. Abbé Janvier WOPOULÉ, premier curé." },
];

export default function Histoire() {
  return (
    <>
      <PageHero
        title="Notre Histoire"
        subtitle="Plus de 60 ans de foi, de service et de communauté à Douala"
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">CHRONOLOGIE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 40 }}>Dates clés de la paroisse</h2>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {DATES_CLES.map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div style={{ width: 48, height: 48, background: "#0B3D91", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                    <span style={{ fontSize: "1.1rem" }}>✝</span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 flex-1 hover:border-yellow-200 hover:shadow-sm transition-all">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 4 }}>{item.date.toUpperCase()}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "1rem", marginBottom: 6 }}>{item.event}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#F5F7FA" }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">EXTENSION</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>L'extension vers Youpwè</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 40, maxWidth: 640 }}>
            Dans les années 1990, la paroisse Saint Dominique Savio a étendu sa mission vers le quartier de Youpwè, donnant naissance à une nouvelle communauté qui deviendra une paroisse autonome en 2015.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {YOUPWE_DATES.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all">
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#0B3D91", letterSpacing: "0.08em", marginBottom: 4 }}>{item.date}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "0.95rem", marginBottom: 6 }}>{item.event}</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-8 px-4 bg-white flex justify-center gap-4 flex-wrap">
        <Link to="/paroisse/genese"
          style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
          ← Genèse
        </Link>
        <Link to="/paroisse"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
          La Paroisse →
        </Link>
      </div>
    </>
  );
}
