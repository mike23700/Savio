import { useEffect, useState } from "react"

import { apiGet, apiPatch, apiDelete } from "@/lib/api"

import { confirmDialog } from "./ConfirmDialog"

import Icon from "@/components/Icon"

/** Requests sent from the form under /celebrer/sacrements. */
interface Demande {
  id: number
  sacrement_nom: string | null
  nom: string
  prenom: string
  email: string | null
  telephone: string
  personnes: { nom: string; prenom: string; age: number | null }[]
  message: string | null
  statut: "nouvelle" | "en_cours" | "traitee" | "annulee"
  created_at: string
}

const STATUT: Record<Demande["statut"], { bg: string; color: string; label: string }> = {
  nouvelle: { bg: "#fef3c7", color: "#92400e", label: "Nouvelle" },
  en_cours: { bg: "#dbeafe", color: "#1d4ed8", label: "En cours" },
  traitee: { bg: "#dcfce7", color: "#15803d", label: "Traitée" },
  annulee: { bg: "#f3f4f6", color: "#6b7280", label: "Annulée" },
}

export default function AdminDemandesSacrements() {
  const [rows, setRows] = useState<Demande[]>([])

  const [statut, setStatut] = useState("")

  const [sacrement, setSacrement] = useState("")

  function load() {
    apiGet<Demande[]>("/admin/demandes-sacrements").then(setRows)
  }

  useEffect(load, [])

  async function setStatus(id: number, s: Demande["statut"]) {
    await apiPatch(`/admin/demandes-sacrements/${id}`, { statut: s })
    load()
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer cette demande ?"))) return
    await apiDelete(`/admin/demandes-sacrements/${id}`)
    load()
  }

  const sacrementNames = [...new Set(rows.map((r) => r.sacrement_nom).filter(Boolean))] as string[]

  const visible = rows.filter(
    (r) =>
      (!statut || r.statut === statut) &&
      (!sacrement || (sacrement === "-" ? !r.sacrement_nom : r.sacrement_nom === sacrement)),
  )

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>
          Demandes de sacrements
        </h1>
        <div className="flex gap-2 flex-wrap">
          <select value={sacrement} onChange={(e) => setSacrement(e.target.value)} style={filterStyle}>
            <option value="">Tous les sacrements</option>
            {sacrementNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="-">Non précisé</option>
          </select>
          <select value={statut} onChange={(e) => setStatut(e.target.value)} style={filterStyle}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUT).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Reçue le</th>
            <th style={th}>Demandeur</th>
            <th style={th}>Sacrement</th>
            <th style={th}>Personnes concernées</th>
            <th style={th}>Statut</th>
            <th style={th} />
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...td, textAlign: "center", color: "#9ca3af" }}>
                Aucune demande.
              </td>
            </tr>
          )}
          {visible.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem", verticalAlign: "top" }}>
              <td style={td}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
              <td style={td}>
                <strong>
                  {r.prenom} {r.nom}
                </strong>
                <br />
                <a href={`tel:${r.telephone}`} style={{ color: "#0B3D91" }}>
                  {r.telephone}
                </a>
                {r.email && (
                  <>
                    <br />
                    <a href={`mailto:${r.email}`} style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                      {r.email}
                    </a>
                  </>
                )}
              </td>
              <td style={td}>{r.sacrement_nom ?? "—"}</td>
              <td style={td}>
                {r.personnes.map((p, i) => (
                  <div key={i}>
                    {p.prenom} {p.nom}
                    {p.age !== null && p.age !== undefined && (
                      <span style={{ color: "#6b7280" }}> — {p.age} ans</span>
                    )}
                  </div>
                ))}
                {r.message && (
                  <div style={{ marginTop: 6, fontSize: "0.78rem", color: "#4b5563", whiteSpace: "pre-line" }}>
                    {r.message}
                  </div>
                )}
              </td>
              <td style={td}>
                <select
                  value={r.statut}
                  onChange={(e) => setStatus(r.id, e.target.value as Demande["statut"])}
                  style={{
                    ...filterStyle,
                    background: STATUT[r.statut].bg,
                    color: STATUT[r.statut].color,
                    fontWeight: 700,
                  }}
                >
                  {Object.entries(STATUT).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </td>
              <td style={td}>
                <button
                  onClick={() => remove(r.id)}
                  title="Supprimer"
                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th: React.CSSProperties = { padding: "10px 14px" }

const td: React.CSSProperties = { padding: "12px 14px" }

const filterStyle: React.CSSProperties = {
  padding: "7px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: "0.8rem",
  background: "#fff",
}
