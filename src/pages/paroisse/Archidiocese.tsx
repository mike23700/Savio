import { Link } from "react-router";

export default function Archidiocese() {
  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1400&h=500&fit=crop&auto=format" alt="Archidiocèse" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/paroisse" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>La Paroisse</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Archidiocèse</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>L'Archidiocèse de Douala</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Notre ancrage diocésain</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.85 }} className="space-y-4">
              <p>
                La paroisse Saint Dominique Savio fait partie de l'<strong style={{ color: "#0B3D91" }}>Archidiocèse de Douala</strong>, dont le siège épiscopal est la Cathédrale Saints Pierre et Paul de Douala.
              </p>
              <p>
                Notre paroisse est rattachée au <strong style={{ color: "#0B3D91" }}>Doyenné Wouri I</strong>, l'un des doyennés de l'archidiocèse, regroupant plusieurs paroisses du secteur de Douala.
              </p>
              <p>
                L'Archidiocèse de Douala est l'un des diocèses catholiques les plus actifs du Cameroun, animé par une vie ecclésiale intense et un engagement fort au service de l'évangélisation et du développement humain.
              </p>
              <p>
                La Conférence Épiscopale Nationale du Cameroun (<strong style={{ color: "#0B3D91" }}>CENC</strong>) regroupe tous les évêques catholiques du Cameroun et coordonne l'action de l'Église à l'échelle nationale.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              {[
                { label: "Archidiocèse", value: "Douala" },
                { label: "Doyenné", value: "Wouri I" },
                { label: "Pays", value: "Cameroun" },
                { label: "Conférence épiscopale", value: "CENC" },
                { label: "Cathédrale", value: "Saints Pierre et Paul" },
                { label: "Notre paroisse fondée", value: "4 décembre 1961" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-blue-100 last:border-0">
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#6b7280" }}>{item.label}</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", fontWeight: 700, color: "#0B3D91" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#F5F7FA", borderRadius: 20, padding: 32 }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>L'Église au Cameroun</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: "⛪", title: "Cathédrale Saints Pierre et Paul", desc: "Siège épiscopal de l'Archidiocèse de Douala" },
                { icon: "🌍", title: "CENC", desc: "Conférence Épiscopale Nationale du Cameroun - coordination nationale de l'Église" },
                { icon: "🏘️", title: "Doyenné Wouri I", desc: "Notre doyenné regroupant plusieurs paroisses du secteur" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: 10 }}>{item.icon}</span>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, color: "#1c2340", marginBottom: 8, fontSize: "0.95rem" }}>{item.title}</h4>
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
