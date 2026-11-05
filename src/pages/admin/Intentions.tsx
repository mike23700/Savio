import { useEffect, useState } from "react"

import { apiGet, apiPatch } from "@/lib/api"

interface Intention {
  id: number

  nom: string

  prenom: string

  telephone: string

  email: string | null

  description: string

  date_souhaitee: string | null

  heure_souhaitee: string | null

  messe_type: string | null

  statut: string

  created_at: string
}

export default function AdminIntentions() {
  const [rows, setRows] = useState<Intention[]>([])

  /** Filters: mass date (exact day or range) and status. */
  const [dateFrom, setDateFrom] = useState("")

  const [dateTo, setDateTo] = useState("")

  const [statut, setStatut] = useState("")

  const [q, setQ] = useState("")

  const visible = rows.filter((r) => {
    const d = r.date_souhaitee?.slice(0, 10) ?? ""
    if (dateFrom && (!d || d < dateFrom)) return false
    if (dateTo && (!d || d > dateTo)) return false
    if (statut && r.statut !== statut) return false
    if (q) {
      const hay = `${r.prenom} ${r.nom} ${r.telephone} ${r.description}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  const filterInput: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: "0.83rem",
    background: "#fff",
  }

  function load() {
    apiGet<Intention[]>("/admin/intentions").then(setRows)
  }

  useEffect(load, [])

  async function updateStatut(id: number, statut: string) {
    await apiPatch(`/admin/intentions/${id}`, { statut })

    load()
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.6rem",
          color: "#1c2340",
          marginBottom: 24,
        }}
      >
        Intentions de messe
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "flex-end",
          marginBottom: 16,
          fontSize: "0.78rem",
          color: "#6b7280",
        }}
      >
        <label>
          Messe du
          <br />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={filterInput} />
        </label>
        <label>
          au
          <br />
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} style={filterInput} />
        </label>
        <label>
          Statut
          <br />
          <select value={statut} onChange={(e) => setStatut(e.target.value)} style={filterInput}>
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="planifiee">Planifiée</option>
            <option value="celebree">Célébrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </label>
        <label>
          Recherche
          <br />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, téléphone, intention…" style={{ ...filterInput, width: 220 }} />
        </label>
        <button
          type="button"
          onClick={() => {
            const d = new Date()
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
            setDateFrom(iso)
            setDateTo(iso)
          }}
          style={{ ...filterInput, cursor: "pointer", fontWeight: 600, color: "#0B3D91" }}
        >
          Aujourd'hui
        </button>
        {(dateFrom || dateTo || statut || q) && (
          <button
            type="button"
            onClick={() => {
              setDateFrom("")
              setDateTo("")
              setStatut("")
              setQ("")
            }}
            style={{ ...filterInput, cursor: "pointer" }}
          >
            Réinitialiser
          </button>
        )}
        <span style={{ marginLeft: "auto" }}>
          {visible.length} / {rows.length} intention(s)
        </span>
      </div>
      <table
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#F5F7FA",
              textAlign: "left",
              fontSize: "0.75rem",
              color: "#6b7280",
            }}
          >
            <th style={th}>Demandeur</th>
            <th style={th}>Intention</th>
            <th style={th}>Messe souhaitée</th>
            <th style={th}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr>
              <td style={{ ...td, textAlign: "center", color: "#9ca3af" }} colSpan={4}>
                Aucune intention pour ces filtres.
              </td>
            </tr>
          )}
          {visible.map((r) => (
            <tr
              key={r.id}
              style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}
            >
              <td style={td}>
                {r.prenom} {r.nom}
                <br />
                <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                  {r.telephone}
                </span>
              </td>
              <td style={td}>{r.description}</td>
              <td style={td}>
                {r.date_souhaitee
                  ? new Date(
                      `${r.date_souhaitee.slice(0, 10)}T12:00:00`,
                    ).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
                {r.heure_souhaitee && (
                  <>
                    <br />
                    <span style={{ color: "#0B3D91", fontWeight: 700 }}>
                      {r.heure_souhaitee}
                    </span>
                    {r.messe_type && (
                      <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                        {" "}
                        · {r.messe_type}
                      </span>
                    )}
                  </>
                )}
              </td>
              <td style={td}>
                <select
                  value={r.statut}
                  onChange={(e) => updateStatut(r.id, e.target.value)}
                  style={inputStyle}
                >
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
  )
}

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: "0.82rem",
}

const th: React.CSSProperties = { padding: "10px 14px" }

const td: React.CSSProperties = { padding: "10px 14px" }
