import { Link } from "react-router";
import pretre2 from "@/imports/pretre2.jpg";

const CURES = [
  { name: "Abbé Robert LÉPINE", years: "1964 – 1966", order: 1, desc: "Spiritain, premier prêtre responsable de la communauté naissante. Il pose les fondements pastoraux de la paroisse et prépare les premières catéchèses.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Jean RIVAIN", years: "1966 – 1969", order: 2, desc: "Spiritain, il poursuit l'œuvre de son prédécesseur et développe les premières communautés chrétiennes dans le quartier de New-Bell.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Pierre SAURET", years: "1969 – 1972", order: 3, desc: "Spiritain, il développe la structure pastorale de la paroisse et renforce les liens avec les mouvements catholiques locaux.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Pierre PAPON", years: "1972 – 1973", order: 4, desc: "Spiritain, curé de transition, il prépare l'arrivée du premier curé résident permanent de la paroisse.", img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Michel LÉCUYER", years: "1973 – 1987", order: 5, desc: "Spiritain, premier curé résident de la paroisse depuis septembre 1973. Il préside à l'érection canonique officielle en 1974 et construit l'identité spirituelle de la communauté.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Antoine BABÉ", years: "1987 – 1990", order: 6, desc: "Il consolide la croissance de la paroisse et développe les structures de la vie communautaire, notamment les groupes de prière.", img: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Simon EPÉA", years: "1990 – 1996", order: 7, desc: "Il approfondit l'enracinement de la paroisse dans le tissu social et ecclésial de Douala, et dynamise la vie des CEV.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Bonaventure TAA", years: "1996 – 2003", order: 8, desc: "Sous sa conduite, la paroisse connaît un essor remarquable. Il engage des travaux de rénovation et renforce la pastorale familiale.", img: "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Étienne NGUE", years: "2003 – 2012", order: 9, desc: "Long mandat marqué par la structuration de la vie paroissiale, le développement de la catéchèse et l'extension vers le quartier de Youpwè.", img: "https://images.unsplash.com/photo-1609159673399-e6b3da1a7a7b?w=300&h=380&fit=crop&auto=format" },
  { name: "Prof. Abbé Oscar EONÉ EONÉ", years: "2012 – 2016", order: 10, desc: "Professeur de théologie, il apporte une dimension intellectuelle et académique à la vie paroissiale, enrichissant les homélies et la formation des fidèles.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=380&fit=crop&auto=format" },
  { name: "Mgr Sébastien MONGO-BEHON", years: "2016 – 2018", order: 11, desc: "Évêque auxiliaire de Douala, sa présence à la tête de la paroisse fut un honneur particulier pour toute la communauté paroissiale.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Jacques Luc BAKOUBA BAKINDE", years: "2018 – 2020", order: 12, desc: "Il poursuit le développement pastoral et engage la communauté dans une dynamique de renouveau liturgique et sacramentel.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Philippe Pacôme MBANDA MANDENGUE", years: "2020 – 2022", order: 13, desc: "Il guide la paroisse pendant la période difficile de la pandémie de Covid-19, maintenant le lien communautaire et assurant la continuité pastorale.", img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=380&fit=crop&auto=format" },
  { name: "Abbé Jean-Robert FANKAM NGANDJUI", years: "2022 – présent", order: 14, desc: "Curé actuel de la paroisse, il conduit notre communauté avec dynamisme, renforçant la vie spirituelle, la solidarité et l'engagement missionnaire de tous les fidèles.", img: pretre2, isCurrent: true },
];

export default function Genese() {
  return (
    <>
      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1400&h=600&fit=crop&auto=format" alt="Genèse de la Paroisse" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Genèse</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Genèse de la Paroisse</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Les origines et fondements de notre communauté de foi à Douala</p>
        </div>
      </div>

      {/* Section 1 : Origines */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">LES ORIGINES</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>
            1961 : La naissance d'une communauté
          </h2>

          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.92rem", color: "#4b5563", lineHeight: 1.9 }} className="space-y-6 mb-12">
            <p>
              La paroisse Saint Dominique Savio trouve ses origines en <strong style={{ color: "#0B3D91" }}>1961</strong>, lorsque le Père Alexis Derrien, Spiritain, acquit un terrain de <strong style={{ color: "#0B3D91" }}>3 000 m²</strong> dans le quartier populaire de New-Bell Bonadoumbé à Douala. Ce geste simple mais fondateur allait être le premier pas d'une communauté chrétienne appelée à rayonner dans tout le quartier et au-delà.
            </p>
            <p>
              C'est sous l'impulsion de <strong style={{ color: "#0B3D91" }}>Monseigneur Thomas Mongo</strong>, archevêque de Douala, et de l'Abbé Robert Lépine que naquit la vision d'implanter l'Église au cœur de ce quartier populaire. Cette démarche missionnaire reflétait l'engagement profond de l'Église catholique à rejoindre les hommes et les femmes dans leur vie quotidienne.
            </p>
            <p>
              À proximité immédiate du terrain acquis, les <strong style={{ color: "#0B3D91" }}>Sœurs du Saint-Esprit</strong> dirigeaient déjà une école primaire qui portait le nom de <em>Dominique Savio</em>. Ce voisinage n'était pas fortuit : il annonçait la vocation particulière de cette future paroisse pour l'éducation, la jeunesse et la famille, qui allait devenir une caractéristique essentielle de son identité.
            </p>
            <p>
              Les premières réunions de prière se tiennent dans des salles modestes. La Sœur Christian Nourry joue un rôle précieux dans la préparation des enfants à la première communion et à la confirmation, posant ainsi les premières pierres de la catéchèse paroissiale.
            </p>
          </div>

          {/* Dates-clés */}
          <div style={{ borderLeft: "3px solid #D4AF37", paddingLeft: 28 }} className="space-y-10 mb-16">
            {[
              { year: "1961", title: "Achat du terrain fondateur", desc: "Le Père Alexis Derrien, Spiritain, acquiert 3 000 m² à New-Bell Bonadoumbé. Ce terrain devient la pierre angulaire de la future paroisse." },
              { year: "1962–1963", title: "Premières célébrations", desc: "Mgr Thomas Mongo et Abbé Robert Lépine établissent les premières structures liturgiques. Des messes sont célébrées dans des locaux provisoires du quartier." },
              { year: "1964", title: "Première salle de culte", desc: "Construction de la première salle dédiée au culte. L'Abbé Lépine devient le premier prêtre responsable officiel. La Sœur Christian Nourry prépare les enfants aux sacrements." },
              { year: "1966", title: "Naissance des premières communautés", desc: "Les premières communautés chrétiennes de base s'organisent dans les quartiers environnants. La vie associative paroissiale prend son essor." },
              { year: "Septembre 1973", title: "Premier curé résident", desc: "L'Abbé Michel Lécuyer, Spiritain, devient le premier curé résident permanent de la paroisse. Cette étape marque la maturité institutionnelle de la communauté." },
              { year: "1974", title: "Érection canonique officielle", desc: "Mgr Simon Tonye, archevêque de Douala, procède à l'érection canonique officielle de la Paroisse Saint Dominique Savio. La communauté est désormais une paroisse à part entière dans l'Archidiocèse de Douala." },
            ].map((item) => (
              <div key={item.year} className="flex gap-5">
                <div className="shrink-0 pt-1">
                  <div style={{ width: 64, minHeight: 64, background: "#0B3D91", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 6px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", textAlign: "center", lineHeight: 1.3 }}>{item.year}</span>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", fontSize: "1.05rem", marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.84rem", color: "#6b7280", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-blue-50 rounded-2xl p-10 border border-blue-100 text-center mb-16">
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>✝</div>
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", fontStyle: "italic", color: "#0B3D91", lineHeight: 1.7 }}>
              "L'Église naît là où l'on annonce l'Évangile, là où on rassemble les hommes et les femmes au nom du Christ."
            </blockquote>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#9ca3af", marginTop: 16 }}>
              — Esprit de la fondation de la Paroisse Saint Dominique Savio, 1961
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Curés successifs */}
      <section className="py-20 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">SUCCESSION PASTORALE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>
            Les curés qui nous ont précédés
          </h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 48, lineHeight: 1.7, maxWidth: 600 }}>
            Depuis 1964, quatorze prêtres ont guidé notre communauté. Chacun a apporté sa pierre à l'édifice spirituel de notre paroisse.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURES.map((cure) => (
              <div key={cure.order}
                className="bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: cure.isCurrent ? "#D4AF37" : "#f3f4f6", boxShadow: cure.isCurrent ? "0 0 0 2px #D4AF37" : undefined }}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cure.img}
                    alt={cure.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.82) 0%, transparent 55%)" }} />
                  <div className="absolute top-3 left-3">
                    <span style={{
                      fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700,
                      background: cure.isCurrent ? "#D4AF37" : "#0B3D91",
                      color: "white", letterSpacing: "0.06em", borderRadius: 20, padding: "3px 10px"
                    }}>
                      {cure.isCurrent ? "CURÉ ACTUEL" : `N° ${cure.order}`}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#D4AF37" }}>{cure.years}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.35, marginBottom: 8 }}>{cure.name}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.65 }}>{cure.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex gap-4 flex-wrap">
          <Link to="/paroisse/histoire"
            style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
            Notre Histoire complète →
          </Link>
          <Link to="/paroisse/equipe"
            style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
            L'équipe actuelle
          </Link>
          <Link to="/paroisse"
            style={{ border: "2px solid #e5e7eb", color: "#6b7280", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem" }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:border-gray-400 transition-colors">
            ← La Paroisse
          </Link>
        </div>
      </section>
    </>
  );
}
