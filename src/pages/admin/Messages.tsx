import { useEffect, useState } from "react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";

interface Message {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  statut: "nouveau" | "traite" | "archive";
  created_at: string;
}

const SUJETS: Record<string, string> = {
  general: "Question générale",
  sacrement: "Demande de sacrement",
  catechese: "Catéchèse",
  don: "Don / Offrande",
  location: "Location salle paroissiale",
  intention: "Intention de messe",
  bans: "Publication des bans",
  autre: "Autre",
};

const STATUT_STYLE: Record<Message["statut"], { bg: string; color: string; label: string }> = {
  nouveau: { bg: "#fef3c7", color: "#92400e", label: "Nouveau" },
  traite: { bg: "#dcfce7", color: "#15803d", label: "Traité" },
  archive: { bg: "#f3f4f6", color: "#6b7280", label: "Archivé" },
};

export default function AdminMessages() {
  const [rows, setRows] = useState<Message[]>([]);
  const [filter, setFilter] = useState("");

  function load(statut = "") {
    apiGet<Message[]>(`/admin/contact${statut ? `?statut=${statut}` : ""}`).then(setRows);
  }

  useEffect(() => load(), []);

  async function setStatus(id: number, statut: Message["statut"]) {
    await apiPatch(`/admin/contact/${id}`, { statut });
    load(filter);
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer ce message ?"))) return;
    await apiDelete(`/admin/contact/${id}`);
    load(filter);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Messages de contact</h1>
        <div className="flex gap-2">
          {[
            { value: "", label: "Tous" },
            { value: "nouveau", label: "Nouveaux" },
            { value: "traite", label: "Traités" },
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
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Aucun message pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((m) => {
            const st = STATUT_STYLE[m.statut];
            return (
              <div key={m.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span style={{ background: st.bg, color: st.color, borderRadius: 20, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>{st.label}</span>
                  <strong style={{ fontSize: "0.9rem", color: "#1c2340" }}>{m.prenom} {m.nom}</strong>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{SUJETS[m.sujet] || m.sujet}</span>
                  <span style={{ fontSize: "0.72rem", color: "#9ca3af", marginLeft: "auto" }}>
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 8 }}>
                  ✉️ {m.email}{m.telephone ? ` · 📞 ${m.telephone}` : ""}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-line" }}>{m.message}</p>
                <div className="flex gap-3 mt-3">
                  {m.statut !== "traite" && (
                    <button onClick={() => setStatus(m.id, "traite")} style={btn("#16a34a")}>✓ Marquer traité</button>
                  )}
                  {m.statut !== "archive" && (
                    <button onClick={() => setStatus(m.id, "archive")} style={btn("#6b7280")}>Archiver</button>
                  )}
                  <button onClick={() => remove(m.id)} style={btn("#b91c1c")}>Supprimer</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function btn(color: string): React.CSSProperties {
  return { background: "none", border: "none", color, cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, padding: 0 };
}
