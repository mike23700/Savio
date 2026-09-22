import { useState } from "react";
import { Link } from "react-router";

export default function Bans() {
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    fiance1Nom: "", fiance1Prenom: "", fiance1Age: "",
    fiance2Nom: "", fiance2Prenom: "", fiance2Age: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=500&fit=crop&auto=format" alt="Publication des bans" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Célébrer</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Publication des bans</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Publication des bans</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Démarches pour le sacrement du mariage</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Explications */}
          <div className="mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">MARIAGE CATHOLIQUE</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 12 }}>Qu'est-ce que la publication des bans ?</h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8 }}>
              La publication des bans est une annonce officielle d'un mariage prochain, faite à la communauté paroissiale. Elle est obligatoire dans l'Église catholique et permet à tout fidèle qui connaîtrait un empêchement au mariage de le signaler. Les bans sont publiés trois dimanches consécutifs avant la date du mariage.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.1em", marginBottom: 16 }}>DOCUMENTS REQUIS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Acte de baptême récent (moins de 6 mois) pour les deux fiancés",
                "Acte de naissance des deux fiancés",
                "Carte nationale d'identité des deux fiancés",
                "Certificat de confirmation des deux fiancés",
                "Attestation de célibat ou de liberté matrimoniale",
                "2 photos d'identité de chaque fiancé",
                "Attestation de suivi de la préparation au mariage",
                "Lettre de demande adressée au curé",
              ].map((doc) => (
                <div key={doc} className="flex items-start gap-2">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0B3D91", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", lineHeight: 1.6 }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">💍</div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>Demande enregistrée !</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                Votre demande de publication des bans a été reçue. Le secrétariat vous contactera dans les plus brefs délais.
              </p>
              <button onClick={() => setSubmitted(false)}
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                Nouvelle demande
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1c2340", marginBottom: 24 }}>Formulaire de demande</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact */}
                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>CONTACT PRINCIPAL</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Nom *</label>
                      <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Prénom *</label>
                      <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Téléphone *</label>
                      <input required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="(+237) 6XX XXX XXX" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Fiancé 1 */}
                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>FIANCÉ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Nom *</label>
                      <input required value={form.fiance1Nom} onChange={e => setForm({ ...form, fiance1Nom: e.target.value })} placeholder="Nom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Prénom *</label>
                      <input required value={form.fiance1Prenom} onChange={e => setForm({ ...form, fiance1Prenom: e.target.value })} placeholder="Prénom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Âge *</label>
                      <input required type="number" value={form.fiance1Age} onChange={e => setForm({ ...form, fiance1Age: e.target.value })} placeholder="Âge" className={inputClass} style={inputStyle} min="18" />
                    </div>
                  </div>
                </div>

                {/* Fiancée 2 */}
                <div>
                  <h4 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.08em", marginBottom: 12 }}>FIANCÉE</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Nom *</label>
                      <input required value={form.fiance2Nom} onChange={e => setForm({ ...form, fiance2Nom: e.target.value })} placeholder="Nom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Prénom *</label>
                      <input required value={form.fiance2Prenom} onChange={e => setForm({ ...form, fiance2Prenom: e.target.value })} placeholder="Prénom" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Âge *</label>
                      <input required type="number" value={form.fiance2Age} onChange={e => setForm({ ...form, fiance2Age: e.target.value })} placeholder="Âge" className={inputClass} style={inputStyle} min="18" />
                    </div>
                  </div>
                </div>

                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                  Soumettre la demande 💍
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
