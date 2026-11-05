import { useEffect, useRef, useState } from "react"

import { apiGet, apiPost, apiPut, apiDelete, apiFormData, mediaUrl, ApiError } from "@/lib/api"

import { confirmDialog } from "./ConfirmDialog"


/** One member of the council / movement team shown on its public page. */
interface Membre {
  nom: string
  titre: string | null
  photo: string | null
}

interface Row {
  id: number

  category: string

  icon: string

  title: string

  description: string

  content: string

  color: string

  is_active: boolean

  details: { id: number; detail: string }[]

  membres: Membre[] | null
}

const emptyForm = {
  category: "conseil",
  icon: "",
  title: "",
  description: "",
  content: "",
  color: "",
  details: "",
  membres: [] as Membre[],
}

export default function AdminMouvements() {
  const [rows, setRows] = useState<Row[]>([])

  const [editingId, setEditingId] = useState<number | "new" | null>(null)

  const [form, setForm] = useState(emptyForm)

  function load() {
    apiGet<Row[]>("/admin/mouvements").then(setRows)
  }

  useEffect(load, [])

  function startEdit(r: Row) {
    setEditingId(r.id)

    setForm({
      category: r.category,
      icon: r.icon,
      title: r.title,
      description: r.description || "",

      content: r.content || "",
      color: r.color || "",
      details: r.details.map((d) => d.detail).join("\n"),
      membres: r.membres ?? [],
    })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      ...form,
      details: form.details
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean),
      membres: form.membres.filter((m) => m.nom.trim()),
    }

    if (editingId === "new") await apiPost("/admin/mouvements", payload)
    else if (editingId) await apiPut(`/admin/mouvements/${editingId}`, payload)

    setEditingId(null)

    load()
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer cet élément ?"))) return

    await apiDelete(`/admin/mouvements/${id}`)

    load()
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
          Mouvements & Groupes
        </h1>
        <button
          onClick={() => {
            setEditingId("new")
            setForm(emptyForm)
          }}
          style={{
            background: "#0B3D91",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Ajouter
        </button>
      </div>

      {editingId !== null && (
        <form
          onSubmit={save}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            maxWidth: 880,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Catégorie">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                <option value="conseil">Conseil</option>
                <option value="mouvement">Mouvement</option>
                <option value="chorale">Chorale</option>
                <option value="cev">CEV</option>
              </select>
            </Field>
            <Field label="Icône">
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Titre">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          </Field>
          <Field label="Description courte (carte)">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          </Field>
          <Field label="Contenu détaillé (page)">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          </Field>
          <Field label="Informations pratiques (une par ligne)">
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={3}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          </Field>
          <MembresEditor
            membres={form.membres}
            onChange={(membres) => setForm({ ...form, membres })}
          />

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              style={{
                background: "#0B3D91",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
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
      )}

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
            <th style={th}>Catégorie</th>
            <th style={th}>Titre</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}
            >
              <td style={td}>{r.category}</td>
              <td style={td}>
                {r.icon} {r.title}
              </td>
              <td style={td}>
                <button onClick={() => startEdit(r)} style={linkBtn}>
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
        </tbody>
      </table>
    </div>
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

/** Team editor: photo, name and title of each member, in display order. */
function MembresEditor({
  membres,
  onChange,
}: {
  membres: Membre[]
  onChange: (m: Membre[]) => void
}) {
  const set = (i: number, patch: Partial<Membre>) =>
    onChange(membres.map((m, j) => (j === i ? { ...m, ...patch } : m)))

  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= membres.length) return
    const next = [...membres]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div>
          <strong style={{ fontSize: "0.95rem", color: "#1c2340" }}>
            Équipe ({membres.length})
          </strong>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Photo carrée conseillée (ex. 600×600 px). Cliquez sur la photo pour l'importer ou la changer.
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange([...membres, { nom: "", titre: "", photo: null }])}
          style={{
            background: "#0B3D91",
            color: "#fff",
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Ajouter un membre
        </button>
      </div>

      {membres.length === 0 && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            borderRadius: 10,
            padding: 16,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Aucun membre. Ajoutez les responsables (président, secrétaire, trésorier…).
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 12,
          marginTop: 12,
        }}
      >
        {membres.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <PhotoPicker value={m.photo} onChange={(photo) => set(i, { photo })} />
            <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 8, alignContent: "start" }}>
              <input
                required
                value={m.nom}
                placeholder="Nom et prénom"
                onChange={(e) => set(i, { nom: e.target.value })}
                style={{ ...inputStyle, fontWeight: 600 }}
              />
              <input
                value={m.titre ?? ""}
                placeholder="Titre / fonction (Président, Secrétaire…)"
                onChange={(e) => set(i, { titre: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "#9ca3af", marginRight: "auto" }}>
                  Position {i + 1}
                </span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={iconBtn} title="Monter">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === membres.length - 1}
                  style={iconBtn}
                  title="Descendre"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(membres.filter((_, j) => j !== i))}
                  style={{ ...iconBtn, color: "#dc2626", width: "auto", padding: "0 10px" }}
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Square 96px photo slot: click to upload (folder "team"), × to remove. */
function PhotoPicker({
  value,
  onChange,
}: {
  value: string | null
  onChange: (path: string | null) => void
}) {
  const input = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const src = mediaUrl(value)

  async function upload(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "team")
      const res = await apiFormData<{ path: string }>("/admin/uploads/image", fd, "POST")
      onChange(res.path)
    } catch (e) {
      setError(e instanceof ApiError ? e.errors?.file?.[0] || e.message : "Échec de l'import.")
    } finally {
      setUploading(false)
      if (input.current) input.current.value = ""
    }
  }

  return (
    <div style={{ width: 96, flexShrink: 0 }}>
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => input.current?.click()}
          title={src ? "Changer la photo" : "Importer une photo"}
          style={{
            width: 96,
            height: 96,
            borderRadius: 10,
            overflow: "hidden",
            border: src ? "1px solid #e5e7eb" : "2px dashed #c7d2e0",
            background: "#f5f7fa",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "0.72rem",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {uploading ? (
            "Import…"
          ) : src ? (
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span>
              <span style={{ fontSize: "1.4rem", display: "block" }}>+</span>
              Photo
            </span>
          )}
        </button>
        {src && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            title="Enlever la photo"
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "none",
              background: "#dc2626",
              color: "#fff",
              fontSize: "0.8rem",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {error && <div style={{ color: "#dc2626", fontSize: "0.68rem", marginTop: 4 }}>{error}</div>}
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  fontSize: "0.8rem",
  cursor: "pointer",
}

const smallBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: "0.75rem",
  cursor: "pointer",
}
