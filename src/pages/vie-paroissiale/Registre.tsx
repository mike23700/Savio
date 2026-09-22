import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";

const GROUPES = [
  "Conseil pastoral",
  "Conseil des affaires économiques",
  "Mouvements adultes",
  "Mouvements jeunes",
  "Groupes liturgiques",
  "Communautés du Grand Nord",
  "CHORALES",
];

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  trancheAge: string;
  rue: string;
  quartier: string;
  lieuDit: string;
  membreCEV: string;
  quelleCEV: string;
  membreGroupe: string;
  quelGroupe: string;
  anciennete: string;
}

export default function Registre() {
  const [form, setForm] = useState<FormData>({
    nom: "", prenom: "", email: "", telephone: "",
    trancheAge: "", rue: "", quartier: "", lieuDit: "",
    membreCEV: "", quelleCEV: "", membreGroupe: "", quelGroupe: "", anciennete: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPost("/registre", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email || null,
        telephone: form.telephone,
        tranche_age: form.trancheAge,
        rue: form.rue || null,
        quartier: form.quartier,
        lieu_dit: form.lieuDit || null,
        membre_cev: form.membreCEV === "oui",
        quelle_cev: form.quelleCEV || null,
        membre_groupe: form.membreGroupe === "oui",
        quel_groupe: form.quelGroupe || null,
        anciennete: form.anciennete,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600 as const, color: "#374151" };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>Inscription enregistrée !</h2>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 8, lineHeight: 1.7 }}>
          Votre inscription au registre paroissial a bien été reçue. Nous vous contacterons prochainement.
        </p>
        <Link to="/vie-paroissiale"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          ← Vie Paroissiale
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1400&h=500&fit=crop&auto=format" alt="Registre paroissial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <Link to="/vie-paroissiale" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Vie Paroissiale</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Registre paroissial</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Registre paroissial</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Rejoignez officiellement notre communauté</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">INSCRIPTION</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 8 }}>S'inscrire au registre</h2>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginBottom: 32, lineHeight: 1.7 }}>
            Le registre paroissial nous permet de mieux connaître et accompagner notre communauté. Vos données sont confidentielles.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identité */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Identité</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Nom(s) *</label>
                    <input required value={form.nom} onChange={set("nom")} placeholder="Votre nom" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Prénom(s) *</label>
                    <input required value={form.prenom} onChange={set("prenom")} placeholder="Votre prénom" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={set("email")} placeholder="votre@email.com" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Téléphone *</label>
                    <input required value={form.telephone} onChange={set("telephone")} placeholder="(+237) 6XX XXX XXX" className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="mt-4">
                  <label style={labelStyle} className="block mb-1.5">Tranche d'âge *</label>
                  <select required value={form.trancheAge} onChange={set("trancheAge")} className={inputClass} style={inputStyle}>
                    <option value="">Sélectionner...</option>
                    <option value="0-14">0-14 ans</option>
                    <option value="15-24">15-24 ans</option>
                    <option value="25-64">25-64 ans</option>
                    <option value="65+">65 ans et plus</option>
                  </select>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Adresse</h3>
                <div className="space-y-4">
                  <div>
                    <label style={labelStyle} className="block mb-1.5">Rue</label>
                    <input value={form.rue} onChange={set("rue")} placeholder="Nom de la rue" className={inputClass} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Quartier *</label>
                      <input required value={form.quartier} onChange={set("quartier")} placeholder="Votre quartier" className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">Lieu-dit</label>
                      <input value={form.lieuDit} onChange={set("lieuDit")} placeholder="Lieu-dit, repère" className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CEV */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Communauté Ecclésiale Vivante</h3>
                <div>
                  <label style={labelStyle} className="block mb-1.5">Membre d'une CEV ? *</label>
                  <select required value={form.membreCEV} onChange={set("membreCEV")} className={inputClass} style={inputStyle}>
                    <option value="">Sélectionner...</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                {form.membreCEV === "oui" && (
                  <div className="mt-4">
                    <label style={labelStyle} className="block mb-1.5">Laquelle ?</label>
                    <input value={form.quelleCEV} onChange={set("quelleCEV")} placeholder="Nom de votre CEV" className={inputClass} style={inputStyle} />
                  </div>
                )}
              </div>

              {/* Groupe */}
              <div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Groupe ou mouvement</h3>
                <div>
                  <label style={labelStyle} className="block mb-1.5">Membre d'un groupe ? *</label>
                  <select required value={form.membreGroupe} onChange={set("membreGroupe")} className={inputClass} style={inputStyle}>
                    <option value="">Sélectionner...</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                {form.membreGroupe === "oui" && (
                  <div className="mt-4">
                    <label style={labelStyle} className="block mb-1.5">Lequel ?</label>
                    <select value={form.quelGroupe} onChange={set("quelGroupe")} className={inputClass} style={inputStyle}>
                      <option value="">Sélectionner...</option>
                      {GROUPES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Ancienneté */}
              <div>
                <label style={labelStyle} className="block mb-1.5">Ancienneté dans la paroisse *</label>
                <select required value={form.anciennete} onChange={set("anciennete")} className={inputClass} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  <option value="moins2">Moins de 2 ans</option>
                  <option value="2-5">2-5 ans</option>
                  <option value="5-10">5-10 ans</option>
                  <option value="plus10">Plus de 10 ans</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                  {error}
                </div>
              )}
              <button type="submit"
                style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                S'inscrire au registre paroissial ✝
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
