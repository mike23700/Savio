import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet } from "@/lib/api";

interface Stats {
  intentions_en_attente: number;
  commandes_en_attente: number;
  catechese_inscriptions_en_attente: number;
  registre_cette_semaine: number;
  registre_total: number;
  dernieres_commandes: { id: number; order_number: string; nom: string; prenom: string; total: number; payment_status: string; created_at: string }[];
  dernieres_intentions: { id: number; nom: string; prenom: string; description: string; statut: string; created_at: string }[];
}

const CARDS: { key: keyof Stats; label: string; icon: string; to: string }[] = [
  { key: "commandes_en_attente", label: "Commandes en attente de paiement", icon: "🛒", to: "/admin/commandes" },
  { key: "intentions_en_attente", label: "Intentions de messe en attente", icon: "🙏", to: "/admin/intentions" },
  { key: "catechese_inscriptions_en_attente", label: "Inscriptions catéchèse en attente", icon: "📖", to: "/admin/catechese" },
  { key: "registre_cette_semaine", label: "Nouvelles inscriptions au registre (7 jours)", icon: "📋", to: "/admin/registre" },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiGet<Stats>("/admin/dashboard").then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 4 }}>
        Tableau de bord
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 28 }}>
        Vue d'ensemble de l'activité récente de la paroisse.
      </p>

      {!stats ? (
        <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Chargement...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {CARDS.map((c) => (
              <Link key={c.key} to={c.to} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: 700, color: "#0B3D91" }}>{stats[c.key] as number}</div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 4 }}>{c.label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", color: "#1c2340", marginBottom: 12 }}>Dernières commandes</h2>
              {stats.dernieres_commandes.length === 0 && <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Aucune commande pour le moment.</p>}
              {stats.dernieres_commandes.map((o) => (
                <div key={o.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0" style={{ fontSize: "0.82rem" }}>
                  <span>{o.prenom} {o.nom} · {o.order_number}</span>
                  <span style={{ fontWeight: 700, color: o.payment_status === "paye" ? "#16a34a" : "#D4AF37" }}>{o.total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.05rem", color: "#1c2340", marginBottom: 12 }}>Dernières intentions de messe</h2>
              {stats.dernieres_intentions.length === 0 && <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Aucune intention pour le moment.</p>}
              {stats.dernieres_intentions.map((i) => (
                <div key={i.id} className="py-2 border-b border-gray-50 last:border-0" style={{ fontSize: "0.82rem" }}>
                  <div className="flex justify-between">
                    <span style={{ fontWeight: 600 }}>{i.prenom} {i.nom}</span>
                    <span style={{ color: "#9ca3af" }}>{i.statut}</span>
                  </div>
                  <div style={{ color: "#6b7280", marginTop: 2 }}>{i.description}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
