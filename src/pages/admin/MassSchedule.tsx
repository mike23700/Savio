import { useEffect, useState } from "react"

import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "@/lib/api"

import { confirmDialog } from "./ConfirmDialog"

interface Row {
  id: number
  group_label: string
  weekdays: number[] | null
  recurrence_type: "weekly" | "monthly_nth_weekday" | "special"
  nth_week_of_month: number | null
  time: string | null
  time_label: string | null
  type: string
  note: string | null
  counts_as_mass: boolean
  sort_order: number
  is_active: boolean
}

/** Monday → Sunday (JS weekday numbers: 0 = Sunday). */
const WEEK = [1, 2, 3, 4, 5, 6, 0]

const DAY = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

const DAY_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

/** One-click types: the label and whether it counts as a mass ("next mass", intentions). */
const PRESETS: { type: string; mass: boolean }[] = [
  { type: "Messe", mass: true },
  { type: "Messe dominicale", mass: true },
  { type: "Messe dominicale anticipée", mass: true },
  { type: "Messe pour les malades", mass: true },
  { type: "Adoration du Très Saint Sacrement", mass: false },
  { type: "Confessions", mass: false },
  { type: "Baptêmes des petits-enfants", mass: false },
]

const DAY_SHORTCUTS: { label: string; days: number[] }[] = [
  { label: "Lun → Ven", days: [1, 2, 3, 4, 5] },
  { label: "Week-end", days: [6, 0] },
  { label: "Tous les jours", days: [1, 2, 3, 4, 5, 6, 0] },
  { label: "Aucun", days: [] },
]

const NTH = [
  { value: 1, label: "1er" },
  { value: 2, label: "2e" },
  { value: 3, label: "3e" },
  { value: 4, label: "4e" },
  { value: 5, label: "Dernier" },
]

interface Form {
  type: string
  counts_as_mass: boolean
  recurrence_type: Row["recurrence_type"]
  days: number[]
  nth: number
  /** Several times create several rows at once (new entry only). */
  times: string[]
  time_label: string
  note: string
  is_active: boolean
}

const emptyForm: Form = {
  type: "Messe",
  counts_as_mass: true,
  recurrence_type: "weekly",
  days: [],
  nth: 1,
  times: [""],
  time_label: "",
  note: "",
  is_active: true,
}

const hhmm = (t: string | null) => (t ? t.slice(0, 5).replace(":", "h") : "")

function describe(r: Row): string {
  if (r.recurrence_type === "special") return "Sans jour fixe"
  if (r.recurrence_type === "monthly_nth_weekday") {
    const n = NTH.find((x) => x.value === r.nth_week_of_month)?.label ?? ""
    return `${n} ${DAY_LONG[(r.weekdays ?? [1])[0]].toLowerCase()} du mois`
  }
  return r.group_label
}

export default function AdminMassSchedule() {
  const [rows, setRows] = useState<Row[]>([])

  const [editingId, setEditingId] = useState<number | "new" | null>(null)

  const [form, setForm] = useState<Form>(emptyForm)

  const [error, setError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)

  function load() {
    apiGet<Row[]>("/admin/mass-schedule").then(setRows)
  }

  useEffect(load, [])

  function startNew(preset?: Partial<Form>) {
    setError(null)
    setEditingId("new")
    setForm({ ...emptyForm, ...preset })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function startEdit(r: Row) {
    setError(null)
    setEditingId(r.id)
    setForm({
      type: r.type,
      counts_as_mass: r.counts_as_mass,
      recurrence_type: r.recurrence_type,
      days: r.weekdays ?? [],
      nth: r.nth_week_of_month ?? 1,
      times: [r.time ? r.time.slice(0, 5) : ""],
      time_label: r.time_label ?? "",
      note: r.note ?? "",
      is_active: r.is_active,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function toggleDay(d: number) {
    if (form.recurrence_type === "monthly_nth_weekday") {
      setForm({ ...form, days: [d] })
      return
    }
    setForm({
      ...form,
      days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d],
    })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (form.recurrence_type !== "special" && form.days.length === 0) {
      setError("Cochez au moins un jour.")
      return
    }
    const times = form.times.map((t) => t.trim()).filter(Boolean)
    if (times.length === 0 && !form.time_label.trim()) {
      setError("Indiquez une heure (ou un libellé comme « Toute la nuit »).")
      return
    }
    const base = {
      type: form.type.trim(),
      counts_as_mass: form.counts_as_mass,
      recurrence_type: form.recurrence_type,
      weekdays: form.recurrence_type === "special" ? null : form.days,
      nth_week_of_month: form.recurrence_type === "monthly_nth_weekday" ? form.nth : null,
      time_label: form.time_label.trim() || null,
      note: form.note.trim() || null,
      is_active: form.is_active,
    }
    setSaving(true)
    try {
      if (editingId === "new") {
        for (const time of times.length ? times : [null]) {
          await apiPost("/admin/mass-schedule", { ...base, time })
        }
      } else if (editingId) {
        await apiPut(`/admin/mass-schedule/${editingId}`, { ...base, time: times[0] ?? null })
      }
      setEditingId(null)
      load()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? Object.values(err.errors ?? {})[0]?.[0] || err.message
          : "Erreur lors de l'enregistrement.",
      )
    } finally {
      setSaving(false)
    }
  }

  async function remove(r: Row) {
    if (!(await confirmDialog(`Supprimer « ${r.type} — ${describe(r)} ${hhmm(r.time)} » ?`))) return
    await apiDelete(`/admin/mass-schedule/${r.id}`)
    if (editingId === r.id) setEditingId(null)
    load()
  }

  async function toggleActive(r: Row) {
    await apiPut(`/admin/mass-schedule/${r.id}`, {
      type: r.type,
      counts_as_mass: r.counts_as_mass,
      recurrence_type: r.recurrence_type,
      weekdays: r.weekdays,
      nth_week_of_month: r.nth_week_of_month,
      time: r.time ? r.time.slice(0, 5) : null,
      time_label: r.time_label,
      note: r.note,
      is_active: !r.is_active,
    })
    load()
  }

  /** Masses shown in a weekday column of the overview (other celebrations have their own block). */
  const inColumn = (d: number) =>
    rows
      .filter(
        (r) =>
          r.counts_as_mass &&
          r.recurrence_type === "weekly" &&
          (r.weekdays ?? []).includes(d),
      )
      .sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99"))

  const specials = rows.filter((r) => r.recurrence_type === "special")

  /** Adoration, confessions, baptisms… and rows without a fixed day: shown apart, grouped by type. */
  const others = rows.filter((r) => !r.counts_as_mass || r.recurrence_type !== "weekly")

  const othersByType = [...new Set(others.map((r) => r.type))].map((type) => ({
    type,
    items: others.filter((r) => r.type === type),
  }))

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>
          Horaires des messes
        </h1>
        {editingId === null && (
          <button onClick={() => startNew()} style={primaryBtn}>
            + Ajouter un horaire
          </button>
        )}
      </div>
      <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 20 }}>
        Cochez le type, les jours et l'heure : le regroupement (« Lundi – Vendredi »…) et l'ordre
        d'affichage sont calculés automatiquement. Cliquez sur un horaire du planning pour le
        modifier.
      </p>

      {/* ── Form ── */}
      {editingId !== null && (
        <form onSubmit={save} style={panel}>
          <h2 style={{ fontWeight: 700, color: "#1c2340", marginBottom: 14 }}>
            {editingId === "new" ? "Nouvel horaire" : "Modifier l'horaire"}
          </h2>

          <Step n={1} title="Type">
            <div style={chips}>
              {PRESETS.map((p) => (
                <Chip
                  key={p.type}
                  on={form.type === p.type}
                  onClick={() => setForm({ ...form, type: p.type, counts_as_mass: p.mass })}
                >
                  {p.type}
                </Chip>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Autre (saisir le libellé)"
                style={{ ...input, maxWidth: 340 }}
                required
              />
              <label style={checkLabel}>
                <input
                  type="checkbox"
                  checked={form.counts_as_mass}
                  onChange={(e) => setForm({ ...form, counts_as_mass: e.target.checked })}
                />
                C'est une messe <span style={{ color: "#9ca3af" }}>(prochaine messe, intentions)</span>
              </label>
            </div>
          </Step>

          <Step n={2} title="Fréquence">
            <div style={chips}>
              {(
                [
                  ["weekly", "Chaque semaine"],
                  ["monthly_nth_weekday", "Une fois par mois"],
                  ["special", "Sans jour fixe (texte libre)"],
                ] as const
              ).map(([v, l]) => (
                <Chip
                  key={v}
                  on={form.recurrence_type === v}
                  onClick={() =>
                    setForm({
                      ...form,
                      recurrence_type: v,
                      days: v === "monthly_nth_weekday" ? form.days.slice(0, 1) : form.days,
                    })
                  }
                >
                  {l}
                </Chip>
              ))}
            </div>
          </Step>

          {form.recurrence_type !== "special" && (
            <Step n={3} title={form.recurrence_type === "monthly_nth_weekday" ? "Quel jour du mois ?" : "Jours"}>
              {form.recurrence_type === "monthly_nth_weekday" && (
                <div style={{ ...chips, marginBottom: 8 }}>
                  {NTH.map((n) => (
                    <Chip key={n.value} on={form.nth === n.value} onClick={() => setForm({ ...form, nth: n.value })}>
                      {n.label}
                    </Chip>
                  ))}
                </div>
              )}
              <div style={chips}>
                {WEEK.map((d) => (
                  <Chip key={d} on={form.days.includes(d)} onClick={() => toggleDay(d)} wide>
                    {DAY_LONG[d]}
                  </Chip>
                ))}
              </div>
              {form.recurrence_type === "weekly" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {DAY_SHORTCUTS.map((s) => (
                    <button key={s.label} type="button" onClick={() => setForm({ ...form, days: s.days })} style={linkBtn}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </Step>
          )}

          <Step n={form.recurrence_type === "special" ? 3 : 4} title={editingId === "new" ? "Heure(s)" : "Heure"}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {form.times.map((t, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="time"
                    value={t}
                    onChange={(e) =>
                      setForm({ ...form, times: form.times.map((x, j) => (j === i ? e.target.value : x)) })
                    }
                    style={{ ...input, width: 120 }}
                  />
                  {form.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, times: form.times.filter((_, j) => j !== i) })}
                      style={{ ...linkBtn, color: "#b91c1c" }}
                      title="Retirer cette heure"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {editingId === "new" && (
                <button type="button" onClick={() => setForm({ ...form, times: [...form.times, ""] })} style={secondaryBtn}>
                  + une autre heure
                </button>
              )}
            </div>
            {editingId === "new" && (
              <p style={hint}>Ex. messes de 6h30, 12h30 et 18h30 en une fois : ajoutez les trois heures.</p>
            )}
          </Step>

          <details style={{ marginTop: 6 }} open={!!(form.note || form.time_label)}>
            <summary style={{ cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "#0B3D91" }}>
              Précisions (facultatif)
            </summary>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10, marginTop: 10 }}>
              <label>
                <span style={label}>Afficher à la place de l'heure</span>
                <input
                  value={form.time_label}
                  onChange={(e) => setForm({ ...form, time_label: e.target.value })}
                  placeholder="Toute la nuit, Après 6h30…"
                  style={input}
                />
              </label>
              <label>
                <span style={label}>Note</span>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Jusqu'à 18h15, la veille des solennités…"
                  style={input}
                />
              </label>
            </div>
          </details>

          <label style={{ ...checkLabel, marginTop: 12 }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Affiché sur le site
          </label>

          {error && <div style={errorBox}>{error}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button type="submit" disabled={saving} style={primaryBtn}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* ── Week overview ── */}
      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(130px, 1fr))", gap: 8, minWidth: 940 }}>
          {WEEK.map((d) => (
            <div key={d} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#0B3D91", color: "#fff", textAlign: "center", fontWeight: 700, fontSize: "0.8rem", padding: "8px 4px" }}>
                {DAY_LONG[d]}
              </div>
              <div style={{ padding: 6, display: "grid", gap: 6 }}>
                {inColumn(d).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => startEdit(r)}
                    title="Modifier"
                    style={{
                      textAlign: "left",
                      border: `1px solid ${editingId === r.id ? "#0B3D91" : r.counts_as_mass ? "#dbe6f6" : "#f3e7c4"}`,
                      background: r.counts_as_mass ? "#F2F6FD" : "#FDF8E7",
                      borderRadius: 8,
                      padding: "6px 8px",
                      cursor: "pointer",
                      opacity: r.is_active ? 1 : 0.45,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "#0B3D91", fontSize: "0.9rem" }}>
                      {r.time_label || hhmm(r.time)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#1c2340", lineHeight: 1.3 }}>{r.type}</div>
                    {r.recurrence_type === "monthly_nth_weekday" && (
                      <div style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{describe(r)}</div>
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => startNew({ days: [d] })}
                  style={{ border: "1px dashed #d1d5db", background: "none", borderRadius: 8, padding: "4px", fontSize: "0.75rem", color: "#6b7280", cursor: "pointer" }}
                >
                  + ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 20 }}>
        Planning des messes. Grisé = masqué sur le site.
      </p>

      {/* ── Other celebrations: their own blocks, as on the public page ── */}
      <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", color: "#1c2340", marginBottom: 10 }}>
        Adoration, confessions, messes mensuelles et autres rendez-vous
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12, marginBottom: 28 }}>
        {othersByType.map((g) => (
          <div key={g.type} style={{ background: "#FDF8E7", border: "1px solid #f3e7c4", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700, color: "#92400e", fontSize: "0.85rem", marginBottom: 8 }}>{g.type}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {g.items.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => startEdit(r)}
                  title="Modifier"
                  style={{
                    textAlign: "left",
                    background: "#fff",
                    border: `1px solid ${editingId === r.id ? "#0B3D91" : "#f3e7c4"}`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                    opacity: r.is_active ? 1 : 0.45,
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#1c2340" }}>
                    <strong style={{ color: "#0B3D91" }}>{r.time_label || hhmm(r.time)}</strong>
                    {r.recurrence_type !== "special" && <> · {describe(r)}</>}
                  </div>
                  {r.note && <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{r.note}</div>}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => startNew({ type: "", counts_as_mass: false })}
          style={{ border: "1px dashed #d1d5db", background: "none", borderRadius: 10, padding: 12, fontSize: "0.8rem", color: "#6b7280", cursor: "pointer", minHeight: 80 }}
        >
          + Ajouter un autre rendez-vous (adoration, confessions…)
        </button>
      </div>

      {/* ── Full list ── */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
              <th style={th}>Type</th>
              <th style={th}>Jours</th>
              <th style={th}>Heure</th>
              <th style={th}>Note</th>
              <th style={th}>Site</th>
              <th style={th} />
            </tr>
          </thead>
          <tbody>
            {[...rows.filter((r) => r.recurrence_type !== "special"), ...specials].map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", opacity: r.is_active ? 1 : 0.5 }}>
                <td style={td}>
                  <strong>{r.type}</strong>
                  {!r.counts_as_mass && <span style={{ ...badge, background: "#FDF8E7", color: "#92400e" }}>autre</span>}
                </td>
                <td style={td}>
                  {r.recurrence_type === "weekly" ? (
                    <span style={{ display: "inline-flex", gap: 3, flexWrap: "wrap" }}>
                      {WEEK.map((d) => (
                        <span
                          key={d}
                          style={{
                            ...dayDot,
                            background: (r.weekdays ?? []).includes(d) ? "#0B3D91" : "#f1f5f9",
                            color: (r.weekdays ?? []).includes(d) ? "#fff" : "#9ca3af",
                          }}
                        >
                          {DAY[d]}
                        </span>
                      ))}
                    </span>
                  ) : (
                    describe(r)
                  )}
                </td>
                <td style={{ ...td, fontWeight: 700, color: "#0B3D91", whiteSpace: "nowrap" }}>{r.time_label || hhmm(r.time)}</td>
                <td style={{ ...td, color: "#6b7280", fontSize: "0.78rem", maxWidth: 280 }}>{r.note}</td>
                <td style={td}>
                  <label style={checkLabel}>
                    <input type="checkbox" checked={r.is_active} onChange={() => toggleActive(r)} />
                  </label>
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <button onClick={() => startEdit(r)} style={linkBtn}>Modifier</button>{" "}
                  <button
                    onClick={() =>
                      startNew({
                        type: r.type,
                        counts_as_mass: r.counts_as_mass,
                        recurrence_type: r.recurrence_type,
                        days: r.weekdays ?? [],
                        nth: r.nth_week_of_month ?? 1,
                        note: r.note ?? "",
                        time_label: r.time_label ?? "",
                      })
                    }
                    style={linkBtn}
                  >
                    Dupliquer
                  </button>{" "}
                  <button onClick={() => remove(r)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...td, textAlign: "center", color: "#9ca3af" }}>
                  Aucun horaire. Cliquez sur « + Ajouter un horaire ».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#0B3D91",
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {n}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1c2340", marginBottom: 8 }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

function Chip({
  on,
  onClick,
  children,
  wide,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        padding: wide ? "7px 14px" : "6px 12px",
        borderRadius: 20,
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        border: `1px solid ${on ? "#0B3D91" : "#d1d5db"}`,
        background: on ? "#0B3D91" : "#fff",
        color: on ? "#fff" : "#374151",
      }}
    >
      {on && "✓ "}
      {children}
    </button>
  )
}

const panel: React.CSSProperties = { background: "#fff", border: "1px solid #0B3D91", borderRadius: 12, padding: 20, marginBottom: 24 }

const chips: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6 }

const input: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "inherit" }

const label: React.CSSProperties = { display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }

const hint: React.CSSProperties = { fontSize: "0.75rem", color: "#9ca3af", marginTop: 6 }

const checkLabel: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.83rem", cursor: "pointer" }

const errorBox: React.CSSProperties = { background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: 8, fontSize: "0.83rem", marginTop: 12 }

const primaryBtn: React.CSSProperties = { background: "#0B3D91", color: "#fff", padding: "9px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }

const secondaryBtn: React.CSSProperties = { background: "#fff", color: "#0B3D91", padding: "7px 14px", borderRadius: 8, border: "1px solid #c7d2e0", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }

const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, padding: 0 }

const th: React.CSSProperties = { padding: "10px 12px" }

const td: React.CSSProperties = { padding: "10px 12px", verticalAlign: "top" }

const badge: React.CSSProperties = { marginLeft: 6, fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: 10 }

const dayDot: React.CSSProperties = { fontSize: "0.65rem", fontWeight: 700, padding: "2px 5px", borderRadius: 4 }

const legend: React.CSSProperties = { display: "inline-block", width: 12, height: 12, border: "1px solid", borderRadius: 3, verticalAlign: "middle", marginRight: 4 }
