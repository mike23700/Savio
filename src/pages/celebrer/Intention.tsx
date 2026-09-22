import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";

export default function Intention() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", description: "", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/intentions", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        description: form.description,
        date_souhaitee: form.date || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1631648859463-a42e6ce6d1e4?w=1400&h=500&fit=crop&auto=format" alt="Intention de messe" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Célébrer</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Intention de messe</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Intention de messe</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Faites célébrer une messe pour vos intentions</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-8 flex gap-4 items-start">
            <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>🙏</span>
            <div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 4 }}>Offrande de messe</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#92400e", lineHeight: 1.7 }}>
                L'offrande pour une intention de messe est de <strong>3 000 FCFA</strong>. Elle peut être déposée au secrétariat paroissial ou remise au prêtre.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", fontWeight: 700, color: "#1c2340" }}>Intention reçue !</h3>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 8 }}>
                Votre intention de messe a bien été transmise au secrétariat. Nous vous contacterons pour confirmer la date.
              </p>
              <button onClick={() => setSubmitted(false)}
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
                Nouvelle intention
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Nom *</label>
                    <input required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Votre nom" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Prénom(s) *</label>
                    <input required value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Votre prénom" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Téléphone *</label>
                    <input required value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="(+237) 6XX XXX XXX" className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">Description de l'intention *</label>
                  <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Pour le repos de l'âme de..., Pour la guérison de..., En action de grâce pour..." rows={4} className={inputClass} style={{ ...inputStyle, resize: "vertical" as const }} />
                </div>
                <div>
                  <label style={labelStyle} className="block mb-1.5">Date souhaitée</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass} style={inputStyle} />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                    {error}
                  </div>
                )}
                <button type="submit"
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                  Envoyer mon intention ✝
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
