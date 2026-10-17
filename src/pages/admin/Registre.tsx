import { useEffect, useState } from "react"
import { apiGet, apiPost, apiPut, apiDelete, downloadFile } from "@/lib/api"
import { confirmDialog } from "./ConfirmDialog"
import {
  SACREMENTS,
  SACREMENT_LABELS,
  type RegistreInscription,
  type SacrementType,
} from "@/lib/sacrements"

const ORDER: SacrementType[] = [
  "bapteme",
  "communion",
  "confirmation",
  "mariage",
]

interface FicheForm {
  nom: string
  prenom: string
  email: string
  telephone: string
  tranche_age: string
  rue: string
  quartier: string
  lieu_dit: string
  membre_cev: boolean
  quelle_cev: string
  membre_groupe: boolean
  quel_groupe: string
  anciennete: string
}

const EMPTY_FICHE: FicheForm = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  tranche_age: "",
  rue: "",
  quartier: "",
  lieu_dit: "",
  membre_cev: false,
  quelle_cev: "",
  membre_groupe: false,
  quel_groupe: "",
  anciennete: "",
}

export default function AdminRegistre() {
  const [rows, setRows] = useState<RegistreInscription[]>([])
  const [q, setQ] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<RegistreInscription | null>(null)
  const [loading, setLoading] = useState(true)

  function load(query = "") {
    apiGet<RegistreInscription[]>(
      `/admin/registre${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    )
      .then(setRows)
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  async function remove(id: number) {
    if (
      !(await confirmDialog("Supprimer cette inscription et ses sacrements ?"))
    )
      return
    await apiDelete(`/admin/registre/${id}`)
    load(q)
  }

  function openNew() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(r: RegistreInscription) {
    setEditing(r)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.6rem",
            color: "#1c2340",
          }}
        >
          Registre paroissial
        </h1>
        <button
          onClick={openNew}
          style={{ ...primaryBtn, padding: "10px 18px", borderRadius: 8 }}
        >
          + Inscrire quelqu'un
        </button>
      </div>

      {showForm && (
        <FicheFormPanel
          key={editing?.id ?? "new"}
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            setEditing(null)
            load(q)
          }}
        />
      )}

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            load(e.target.value)
          }}
          placeholder="Rechercher par nom, prénom, téléphone..."
          style={{ ...inputStyle, maxWidth: 340 }}
        />
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
            <th style={th}>Nom</th>
            <th style={th}>Contact</th>
            <th style={th}>Quartier</th>
            <th style={th}>Sacrements</th>
            <th style={th}>Source</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}
            >
              <td style={td}>
                {r.prenom} {r.nom}
              </td>
              <td style={td}>
                {r.telephone}
                {r.email ? ` · ${r.email}` : ""}
              </td>
              <td style={td}>{r.quartier || "—"}</td>
              <td style={td}>
                {r.sacrements.length === 0 ? (
                  "—"
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {r.sacrements.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          background: "#EEF2FF",
                          color: "#0B3D91",
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                        }}
                      >
                        {SACREMENT_LABELS[s.type]}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td style={td}>{r.source === "admin" ? "Admin" : "Public"}</td>
              <td style={td}>
                <button
                  onClick={() =>
                    downloadFile(
                      `/admin/registre/${r.id}/pdf`,
                      `fiche-${r.nom}-${r.prenom}.pdf`,
                    ).catch(() => {})
                  }
                  style={linkBtn}
                >
                  PDF
                </button>
                <button onClick={() => openEdit(r)} style={linkBtn}>
                  Modifier
                </button>
                <button
                  onClick={() => remove(r.id)}
                  style={{ ...linkBtn, color: "#b91c1c" }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td style={{ ...td, color: "#6b7280" }} colSpan={6}>
                Aucune inscription pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function FicheFormPanel({
  initial,
  onClose,
  onSaved,
}: {
  initial: RegistreInscription | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FicheForm>(() =>
    initial
      ? {
          nom: initial.nom,
          prenom: initial.prenom,
          email: initial.email ?? "",
          telephone: initial.telephone,
          tranche_age: initial.tranche_age ?? "",
          rue: initial.rue ?? "",
          quartier: initial.quartier ?? "",
          lieu_dit: initial.lieu_dit ?? "",
          membre_cev: initial.membre_cev,
          quelle_cev: initial.quelle_cev ?? "",
          membre_groupe: initial.membre_groupe,
          quel_groupe: initial.quel_groupe ?? "",
          anciennete: initial.anciennete ?? "",
        }
      : EMPTY_FICHE,
  )

  const [included, setIncluded] =
    useState<Partial<Record<SacrementType, boolean>>>(() => {
      const map: Partial<Record<SacrementType, boolean>> = {}
      if (initial) for (const s of initial.sacrements) map[s.type] = true
      return map
    })

  const [values, setValues] =
    useState<Partial<Record<SacrementType, Record<string, string>>>>(() => {
      const map: Partial<Record<SacrementType, Record<string, string>>> = {}
      if (initial) {
        for (const s of initial.sacrements) {
          const def = SACREMENTS.find((d) => d.type === s.type)!
          const v: Record<string, string> = {}
          for (const f of def.fields) {
            const raw = (s as unknown as Record<string, unknown>)[f.key]
            v[f.key] =
              raw == null
                ? ""
                : f.kind === "date"
                  ? String(raw).slice(0, 10)
                  : String(raw)
          }
          map[s.type] = v
        }
      }
      return map
    })

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (field: keyof FicheForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  function toggle(type: SacrementType) {
    const turningOn = !included[type]
    setIncluded((prev) => ({ ...prev, [type]: !prev[type] }))
    if (!turningOn) return
    const def = SACREMENTS.find((s) => s.type === type)!
    setValues((v) =>
      v[type]?.nom
        ? v
        : {
            ...v,
            [type]: {
              ...(v[type] ?? {}),
              nom: `${form.nom} ${form.prenom}`.trim(),
            },
          },
    )
    if (def.fields.some((f) => f.key === "numero_registre")) {
      apiGet<{ numero_registre: string }>(`/registre/next-numero?type=${type}`)
        .then((res) =>
          setValues((v) => {
            const current = v[type] ?? {}
            if (current.numero_registre) return v
            return {
              ...v,
              [type]: { ...current, numero_registre: res.numero_registre },
            }
          }),
        )
        .catch(() => {})
    }
  }

  function setValue(type: SacrementType, key: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [type]: { ...(prev[type] ?? {}), [key]: value },
    }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const sacrements = ORDER.filter((t) => included[t]).map((type) => {
        const def = SACREMENTS.find((s) => s.type === type)!
        const payload: Record<string, string | null> = { type }
        for (const f of def.fields) {
          const v = (values[type]?.[f.key] ?? "").trim()
          payload[f.key] = v === "" ? null : v
        }
        return payload
      })
      const payload = { ...form, sacrements }
      if (initial) await apiPut(`/admin/registre/${initial.id}`, payload)
      else await apiPost("/admin/registre", payload)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={save}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.1rem",
          color: "#1c2340",
          marginBottom: 16,
        }}
      >
        {initial ? "Modifier l'inscription" : "Nouvelle inscription"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Nom *">
          <input
            required
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Prénom *">
          <input
            required
            value={form.prenom}
            onChange={(e) => set("prenom", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Téléphone *">
          <input
            required
            value={form.telephone}
            onChange={(e) => set("telephone", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Email">
          <input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Tranche d'âge">
          <input
            value={form.tranche_age}
            onChange={(e) => set("tranche_age", e.target.value)}
            placeholder="25-64"
            style={inputStyle}
          />
        </Field>
        <Field label="Quartier">
          <input
            value={form.quartier}
            onChange={(e) => set("quartier", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Rue">
          <input
            value={form.rue}
            onChange={(e) => set("rue", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Lieu-dit">
          <input
            value={form.lieu_dit}
            onChange={(e) => set("lieu_dit", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Ancienneté">
          <input
            value={form.anciennete}
            onChange={(e) => set("anciennete", e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Quel groupe (si membre)">
          <input
            value={form.quel_groupe}
            onChange={(e) => set("quel_groupe", e.target.value)}
            style={inputStyle}
          />
        </Field>
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={form.membre_cev}
            onChange={(e) => set("membre_cev", e.target.checked)}
          />{" "}
          Membre d'une CEV
        </label>
        <label style={checkboxLabel}>
          <input
            type="checkbox"
            checked={form.membre_groupe}
            onChange={(e) => set("membre_groupe", e.target.checked)}
          />{" "}
          Membre d'un groupe
        </label>
      </div>
      {form.membre_cev && (
        <div style={{ marginTop: 12 }}>
          <Field label="Quelle CEV">
            <input
              value={form.quelle_cev}
              onChange={(e) => set("quelle_cev", e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
      )}

      <h2
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.1rem",
          color: "#1c2340",
          margin: "28px 0 12px",
        }}
      >
        Sacrements
      </h2>
      <div style={{ display: "grid", gap: 12 }}>
        {ORDER.map((type) => {
          const def = SACREMENTS.find((s) => s.type === type)!
          const on = !!included[type]
          return (
            <div
              key={type}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <label style={{ ...checkboxLabel, fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(type)}
                />{" "}
                {SACREMENT_LABELS[type]}
              </label>
              {on && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginTop: 14,
                  }}
                >
                  {def.fields.map((f) => (
                    <div
                      key={f.key}
                      style={{
                        gridColumn: f.kind === "textarea" ? "1 / -1" : "auto",
                      }}
                    >
                      <Field label={f.label + (f.required ? " *" : "")}>
                        {f.kind === "textarea" ? (
                          <textarea
                            rows={3}
                            required={f.required}
                            value={values[type]?.[f.key] ?? ""}
                            onChange={(e) =>
                              setValue(type, f.key, e.target.value)
                            }
                            style={inputStyle}
                          />
                        ) : f.kind === "radio" ? (
                          <select
                            required={f.required}
                            value={values[type]?.[f.key] ?? ""}
                            onChange={(e) =>
                              setValue(type, f.key, e.target.value)
                            }
                            style={inputStyle}
                          >
                            <option value="">Sélectionner...</option>
                            {(f.options ?? []).map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={f.kind === "date" ? "date" : "text"}
                            required={f.required}
                            value={values[type]?.[f.key] ?? ""}
                            onChange={(e) =>
                              setValue(type, f.key, e.target.value)
                            }
                            style={inputStyle}
                          />
                        )}
                      </Field>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <p style={{ color: "#b91c1c", fontSize: "0.82rem", marginTop: 12 }}>
          {error}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={saving}
          style={{
            ...primaryBtn,
            padding: "8px 20px",
            borderRadius: 8,
            opacity: saving ? 0.6 : 1,
          }}
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid #e5e7eb",
            padding: "8px 20px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: "0.85rem",
}
const primaryBtn: React.CSSProperties = {
  background: "#0B3D91",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
}
const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: "0.82rem",
  color: "#374151",
}
const th: React.CSSProperties = { padding: "10px 14px" }
const td: React.CSSProperties = { padding: "10px 14px" }
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#0B3D91",
  cursor: "pointer",
  fontSize: "0.8rem",
  marginRight: 12,
}
