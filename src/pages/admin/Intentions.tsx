import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface Intention {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string | null;
  description: string;
  date_souhaitee: string | null;
  heure_souhaitee: string | null;
  messe_type: string | null;
  statut: string;
  created_at: string;
}

export default function AdminIntentions() {
  const [rows, setRows] = useState<Intention[]>([]);

  function load() {
    apiGet<Intention[]>("/admin/intentions").then(setRows);
  }

  useEffect(load, []);

  async function updateStatut(id: number, statut: string) {
    await apiPatch(`/admin/intentions/${id}`, { statut });
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 24 }}>Intentions de messe</h1>
      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Demandeur</th><th style={th}>Intention</th><th style={th}>Messe souhaitée</th><th style={th}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.prenom} {r.nom}<br /><span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{r.telephone}</span></td>
              <td style={td}>{r.description}</td>
              <td style={td}>
                {r.date_souhaitee
                  ? new Date(`${r.date_souhaitee.slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                  : "—"}
                {r.heure_souhaitee && (
                  <><br /><span style={{ color: "#0B3D91", fontWeight: 700 }}>{r.heure_souhaitee}</span>{r.messe_type && <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}> · {r.messe_type}</span>}</>
                )}
              </td>
              <td style={td}>
                <select value={r.statut} onChange={(e) => updateStatut(r.id, e.target.value)} style={inputStyle}>
                  <option value="en_attente">En attente</option>
                  <option value="planifiee">Planifiée</option>
                  <option value="celebree">Célébrée</option>
                  <option value="annulee">Annulée</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: "0.82rem" };
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
