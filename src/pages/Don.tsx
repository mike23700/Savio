import { useState } from "react";
import { Link } from "react-router";
import { apiPost, ApiError } from "@/lib/api";

const MODE_TO_METHOD: Record<string, string> = { orange: "orange_money", mtn: "mtn_momo", especes: "especes" };

interface DonationResult {
  donation: { montant: number };
  payment: { instructions: string };
}

export default function Don() {
  const [montant, setMontant] = useState("");
  const [montantCustom, setMontantCustom] = useState("");
  const [mode, setMode] = useState("orange");
  const [intention, setIntention] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<DonationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MONTANTS = ["2 000", "5 000", "10 000", "25 000", "50 000"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = parseInt((montantCustom || montant).replace(/\s/g, ""), 10);
    try {
      const res = await apiPost<DonationResult>("/donations", {
        montant: amount,
        payment_method: MODE_TO_METHOD[mode],
        intention: intention || null,
      });
      setResult(res);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#374151" };
  const inputStyle = { fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" };

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=500&fit=crop&auto=format"
          alt="Faire un don" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Faire un don</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Soutenir la paroisse</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            Votre générosité permet à la paroisse de vivre et de grandir
          </p>
        </div>
      </div>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Why give */}
          <div className="lg:col-span-2">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">ENSEMBLE</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>
              Pourquoi faire un don ?
            </h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#4b5563", lineHeight: 1.85, marginBottom: 24 }}>
              Vos dons permettent à la paroisse de mener à bien sa mission d'évangélisation, de célébration des sacrements et de service aux plus démunis à travers la Caritas.
            </p>
            <div className="space-y-4">
              {[
                { icon: "⛪", titre: "Entretien de l'église", desc: "Maintenance et rénovation des locaux paroissiaux" },
                { icon: "📚", titre: "Formation & catéchèse", desc: "Matériel pédagogique et formation des catéchistes" },
                { icon: "❤️", titre: "Caritas & solidarité", desc: "Aide aux familles défavorisées de la paroisse" },
                { icon: "🎙️", titre: "Pastorale & célébrations", desc: "Organisation des célébrations et activités pastorales" },
              ].map((r) => (
                <div key={r.titre} className="flex gap-3">
                  <div style={{ width: 36, height: 36, background: "#E8F2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                    {r.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#1c2340" }}>{r.titre}</div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#6b7280", lineHeight: 1.6 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontStyle: "italic", color: "#0B3D91", lineHeight: 1.6 }}>
                « Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte, car Dieu aime celui qui donne avec joie. »
              </blockquote>
              <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37", marginTop: 8, display: "block", fontStyle: "normal", fontWeight: 600 }}>2 Corinthiens 9, 7</cite>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted && result ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-5">🙏</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340" }}>Merci pour votre générosité !</h3>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 10, lineHeight: 1.7, maxWidth: 420, margin: "10px auto 0" }}>
                  Votre don de <strong>{result.donation.montant.toLocaleString("fr-FR")} FCFA</strong> a bien été enregistré.
                </p>
                <div className="bg-blue-50 rounded-xl p-4 mt-5 text-left max-w-md mx-auto">
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#374151", lineHeight: 1.7 }}>{result.payment.instructions}</p>
                </div>
                <button onClick={() => { setSubmitted(false); setResult(null); }}
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90">
                  Faire un autre don
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>Formulaire de don</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label style={labelStyle} className="block mb-3">Montant (FCFA) *</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                      {MONTANTS.map(m => (
                        <button type="button" key={m} onClick={() => { setMontant(m); setMontantCustom(""); }}
                          style={{
                            fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700,
                            background: montant === m ? "#0B3D91" : "#F5F7FA",
                            color: montant === m ? "white" : "#374151",
                            border: montant === m ? "2px solid #0B3D91" : "2px solid transparent",
                          }}
                          className="py-2.5 rounded-xl hover:opacity-90 transition-all">
                          {m}
                        </button>
                      ))}
                    </div>
                    <input value={montantCustom} onChange={e => { setMontantCustom(e.target.value); setMontant(""); }}
                      placeholder="Autre montant (FCFA)" type="number" min="500"
                      className={inputClass} style={inputStyle} />
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <label style={labelStyle} className="block mb-3">Mode de paiement *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "orange", label: "Orange Money", icon: "🟠" },
                        { id: "mtn", label: "MTN MoMo", icon: "🟡" },
                        { id: "especes", label: "Espèces", icon: "💵" },
                      ].map(p => (
                        <button type="button" key={p.id} onClick={() => setMode(p.id)}
                          style={{
                            fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 600,
                            background: mode === p.id ? "#E8F2FF" : "#F5F7FA",
                            color: mode === p.id ? "#0B3D91" : "#374151",
                            border: mode === p.id ? "2px solid #0B3D91" : "2px solid transparent",
                          }}
                          className="py-3 rounded-xl flex flex-col items-center gap-1 hover:opacity-90 transition-all">
                          <span className="text-xl">{p.icon}</span>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                    {mode === "orange" && (
                      <div className="mt-3 bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#92400e" }}>
                          📱 Numéro Orange Money : <strong>(+237) 655 529 999</strong>
                        </p>
                      </div>
                    )}
                    {mode === "especes" && (
                      <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#374151" }}>
                          💵 Les dons en espèces sont reçus au secrétariat paroissial, lun–ven de 8h à 13h et de 15h30 à 18h30.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle} className="block mb-1.5">Intention particulière (optionnel)</label>
                    <input value={intention} onChange={e => setIntention(e.target.value)} placeholder="Ex : pour les travaux, pour la Caritas..." className={inputClass} style={inputStyle} />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}>
                      {error}
                    </div>
                  )}
                  <button type="submit"
                    style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}
                    className="w-full text-white py-4 rounded-xl hover:opacity-90 transition-opacity">
                    ❤️ Confirmer mon don
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
