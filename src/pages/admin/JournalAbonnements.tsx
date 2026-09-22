import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface Subscription {
  id: number;
  status: "active" | "inactive";
  format: string;
  started_at: string;
  user: { nom: string; prenom: string; email: string } | null;
  tarif: { label: string } | null;
}

export default function AdminJournalAbonnements() {
  const [rows, setRows] = useState<Subscription[]>([]);

  function load() {
    apiGet<Subscription[]>("/admin/journal/subscriptions").then(setRows);
  }

  useEffect(load, []);

  async function toggle(id: number, status: "active" | "inactive") {
    await apiPatch(`/admin/journal/subscriptions/${id}`, { status });
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 8 }}>Abonnements au journal</h1>
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: 24 }}>
        Désactiver un abonnement ne bloque pas le compte de l'utilisateur — il pourra toujours se connecter, seul son abonnement au journal devient inactif.
      </p>
      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Utilisateur</th><th style={th}>Formule</th><th style={th}>Format</th><th style={th}>Depuis</th><th style={th}>Statut</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{s.user ? `${s.user.prenom} ${s.user.nom}` : "—"}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{s.user?.email}</span></td>
              <td style={td}>{s.tarif?.label || "—"}</td>
              <td style={td}>{s.format === "electronique" ? "Électronique" : "Papier"}</td>
              <td style={td}>{new Date(s.started_at).toLocaleDateString("fr-FR")}</td>
              <td style={td}>
                <span style={{ background: s.status === "active" ? "#dcfce7" : "#f3f4f6", color: s.status === "active" ? "#15803d" : "#6b7280", borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
                  {s.status === "active" ? "Actif" : "Inactif"}
                </span>
              </td>
              <td style={td}>
                {s.status === "active" ? (
                  <button onClick={() => toggle(s.id, "inactive")} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
                    Désactiver
                  </button>
                ) : (
                  <button onClick={() => toggle(s.id, "active")} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
                    Réactiver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
