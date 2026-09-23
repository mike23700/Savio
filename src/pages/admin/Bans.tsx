import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";

interface Ban {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  fiance1_nom: string;
  fiance1_prenom: string;
  fiance2_nom: string;
  fiance2_prenom: string;
  mariage_date: string | null;
  statut: "nouveau" | "en_cours" | "publie" | "archive";
  created_at: string;
}

const STATUT_STYLE: Record<Ban["statut"], { bg: string; color: string; label: string }> = {
  nouveau: { bg: "#fef3c7", color: "#92400e", label: "Nouveau" },
  en_cours: { bg: "#dbeafe", color: "#1d4ed8", label: "En cours" },
  publie: { bg: "#dcfce7", color: "#15803d", label: "Publié" },
  archive: { bg: "#f3f4f6", color: "#6b7280", label: "Archivé" },
};

export default function AdminBans() {
  const [rows, setRows] = useState<Ban[]>([]);
  const [filter, setFilter] = useState("");

  function load(statut = "") {
    apiGet<Ban[]>(`/admin/bans${statut ? `?statut=${statut}` : ""}`).then(setRows);
  }

  useEffect(() => load(), []);

  async function setStatus(id: number, statut: Ban["statut"]) {
    await apiPatch(`/admin/bans/${id}`, { statut });
    load(filter);
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer cette demande de bans ?"))) return;
    await apiDelete(`/admin/bans/${id}`);
    load(filter);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Publication des bans</h1>
        <div className="flex gap-2">
          {[
            { value: "", label: "Tous" },
            { value: "nouveau", label: "Nouveaux" },
            { value: "en_cours", label: "En cours" },
            { value: "publie", label: "Publiés" },
            { value: "archive", label: "Archivés" },
          ].map((f) => (
            <button key={f.value} onClick={() => { setFilter(f.value); load(f.value); }}
              style={{
                background: filter === f.value ? "#0B3D91" : "#fff",
                color: filter === f.value ? "#fff" : "#374151",
                border: "1px solid #e5e7eb", borderRadius: 20, padding: "6px 14px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Aucune demande de bans pour le moment.</p>
      ) : (
        <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
              <th style={th}>Demandeur</th><th style={th}>Fiancés</th><th style={th}>Contact</th><th style={th}>Statut</th><th style={th}>Reçue le</th><th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const st = STATUT_STYLE[b.statut];
              return (
                <tr key={b.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
                  <td style={td}>
                    <strong>{b.prenom} {b.nom}</strong>
                    {b.mariage_date && (
                      <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>💍 Mariage : {new Date(b.mariage_date + "T00:00:00").toLocaleDateString("fr-FR")}</div>
                    )}
                  </td>
                  <td style={td}>
                    {b.fiance1_prenom} {b.fiance1_nom}
                    <br />
                    {b.fiance2_prenom} {b.fiance2_nom}
                  </td>
                  <td style={td}>
                    {b.telephone}
                    <br />
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{b.email}</span>
                  </td>
                  <td style={td}>
                    <span style={{ background: st.bg, color: st.color, borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>{st.label}</span>
                  </td>
                  <td style={td}>{new Date(b.created_at).toLocaleDateString("fr-FR")}</td>
                  <td style={td}>
                    <div className="flex flex-col gap-1">
                      {b.statut !== "en_cours" && (
                        <button onClick={() => setStatus(b.id, "en_cours")} style={btn("#1d4ed8")}>En cours</button>
                      )}
                      {b.statut !== "publie" && (
                        <button onClick={() => setStatus(b.id, "publie")} style={btn("#16a34a")}>Publier</button>
                      )}
                      <button onClick={() => remove(b.id)} style={btn("#b91c1c")}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "top" };

function btn(color: string): React.CSSProperties {
  return { background: "none", border: "none", color, cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, padding: 0, textAlign: "left" };
}
