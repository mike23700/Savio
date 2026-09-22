import { useState } from "react";
import { Link } from "react-router";
import { PARISH } from "@/data/content";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", sujet: "general", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#374151" };
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1687459730891-47dfa3217811?w=1400&h=500&fit=crop&auto=format"
          alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Contact</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Nous contacter</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            Le secrétariat est à votre disposition pour toute question
          </p>
        </div>
      </div>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info column */}
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-3">
              INFORMATIONS
            </div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>
              Secrétariat paroissial
            </h2>

            <div className="space-y-5">
              {[
                { icon: "📍", title: "Adresse", content: PARISH.address },
                { icon: "📞", title: "Téléphone", content: PARISH.phone, href: `tel:+237655529999` },
                { icon: "✉️", title: "Email", content: PARISH.email, href: `mailto:${PARISH.email}` },
                { icon: "🕐", title: "Horaires", content: PARISH.hours },
              ].map(({ icon, title, content, href }) => (
                <div key={title} className="flex gap-4">
                  <div style={{ width: 42, height: 42, background: "#E8F2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{title}</div>
                    {href ? (
                      <a href={href} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#0B3D91", lineHeight: 1.6 }} className="hover:underline">{content}</a>
                    ) : (
                      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Réseaux sociaux
              </div>
              <div className="flex gap-3">
                {[["💬", "WhatsApp", `https://wa.me/237655529999`], ["📘", "Facebook", "#"], ["▶️", "YouTube", "#"], ["📷", "Instagram", "#"]].map(([icon, name, href]) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer"
                    style={{ width: 40, height: 40, background: "#0B3D91", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}
                    className="hover:opacity-80 transition-opacity" title={name}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-8">
              <a href={PARISH.mapsUrl} target="_blank" rel="noreferrer"
                className="relative block rounded-2xl overflow-hidden h-40 group">
                <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=400&h=200&fit=crop&auto=format"
                  alt="Localisation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "rgba(8,45,107,0.6)" }} />
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                  <span className="text-3xl">📍</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "white" }}>Voir sur Google Maps</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="h-full flex items-center justify-center flex-col text-center py-12">
                <div className="text-6xl mb-5">✅</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: 700, color: "#1c2340" }}>Message envoyé !</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 10, maxWidth: 400, lineHeight: 1.7 }}>
                  Votre message a bien été reçu. Le secrétariat vous répondra dans les meilleurs délais, du lundi au vendredi.
                </p>
                <button onClick={() => setSubmitted(false)}
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90">
                  Nouveau message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 6 }}>
                  Envoyer un message
                </h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#6b7280", marginBottom: 24 }}>
                  Tous les champs marqués d'un * sont obligatoires.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Nom(s) *</label>
                      <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                        placeholder="Votre nom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Prénom(s) *</label>
                      <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                        placeholder="Votre prénom" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="votre@email.com" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Téléphone</label>
                      <input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                        placeholder="(+237) 6XX XXX XXX" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Sujet *</label>
                    <select required value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                      className={inputClass} style={inputStyle}>
                      <option value="general">Question générale</option>
                      <option value="sacrement">Demande de sacrement</option>
                      <option value="catechese">Catéchèse</option>
                      <option value="don">Don / Offrande</option>
                      <option value="location">Location salle paroissiale</option>
                      <option value="intention">Intention de messe</option>
                      <option value="bans">Publication des bans</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Message *</label>
                    <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Votre message..." rows={6}
                      className={inputClass} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <button type="submit"
                    style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.88rem" }}
                    className="w-full text-white py-4 rounded-xl hover:opacity-90 transition-opacity">
                    Envoyer le message ✉️
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section style={{ background: "#F5F7FA" }} className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20, textAlign: "center" }}>
            Accès rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: "🙏", titre: "Intention de messe", desc: "Demander une messe pour vos intentions", to: "/celebrer" },
              { icon: "📜", titre: "Publication des bans", desc: "Annoncer un mariage à la paroisse", to: "/celebrer#sacrements" },
              { icon: "📰", titre: "Journal paroissial", desc: "S'abonner à La Voix de Dominique Savio", to: "/se-nourrir#publications" },
            ].map((a) => (
              <Link to={a.to} key={a.titre}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all text-center group">
                <div className="text-4xl mb-4">{a.icon}</div>
                <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 6 }}>{a.titre}</h4>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
