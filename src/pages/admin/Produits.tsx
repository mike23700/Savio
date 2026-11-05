import { useEffect, useState } from "react"

import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "@/lib/api"

import { confirmDialog } from "./ConfirmDialog"

import ImageUpload, { Thumb } from "./ImageUpload"

interface Row {
  id: number

  nom: string

  prix: number

  prix_barre: number | null

  category: string

  img: string
  images: string[] | null
  description: string
  is_active: boolean
}

interface Category {
  id: number
  name: string
  sort_order: number
}

const emptyForm = {
  nom: "",
  prix: "0",
  prix_barre: "",
  category: "Livres",
  img: "",
  images: [] as string[],
  description: "",
  is_active: true,
}

export default function AdminProduits() {
  const [rows, setRows] = useState<Row[]>([])

  const [editingId, setEditingId] = useState<number | "new" | null>(null)

  const [form, setForm] = useState(emptyForm)

  const [categories, setCategories] = useState<Category[]>([])

  const [catName, setCatName] = useState("")

  const [catEditingId, setCatEditingId] = useState<number | null>(null)

  const [catError, setCatError] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const [filterCat, setFilterCat] = useState("")

  const [q, setQ] = useState("")

  function load() {
    apiGet<Row[]>("/admin/products").then(setRows)
    apiGet<Category[]>("/product-categories").then(setCategories)
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault()
    setCatError(null)
    try {
      if (catEditingId)
        await apiPut(`/admin/product-categories/${catEditingId}`, { name: catName })
      else
        await apiPost("/admin/product-categories", {
          name: catName,
          sort_order: categories.length,
        })
      setCatName("")
      setCatEditingId(null)
      load()
    } catch (err) {
      setCatError(err instanceof ApiError ? err.message : "Erreur.")
    }
  }

  async function removeCategory(c: Category) {
    const used = rows.filter((r) => r.category === c.name).length
    if (
      !(await confirmDialog(
        used
          ? `Supprimer la catégorie « ${c.name} » ? ${used} produit(s) la gardent jusqu'à ce que vous les changiez.`
          : `Supprimer la catégorie « ${c.name} » ?`,
      ))
    )
      return
    await apiDelete(`/admin/product-categories/${c.id}`)
    load()
  }

  useEffect(load, [])

  function startEdit(r: Row) {
    setEditingId(r.id)

    setForm({
      nom: r.nom,
      prix: String(r.prix),
      prix_barre: r.prix_barre ? String(r.prix_barre) : "",

      category: r.category,
      img: r.img || "",
      images: r.images ?? [],
      description: r.description || "",
      is_active: r.is_active,
    })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      ...form,
      prix: parseFloat(form.prix) || 0,
      prix_barre: form.prix_barre ? parseFloat(form.prix_barre) : null,
      images: form.images.filter(Boolean).slice(0, 2),
    }
    setError(null)
    try {
      if (editingId === "new") await apiPost("/admin/products", payload)
      else if (editingId) await apiPut(`/admin/products/${editingId}`, payload)
      setEditingId(null)
      load()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? Object.values(err.errors ?? {})[0]?.[0] || err.message
          : "Erreur lors de l'enregistrement.",
      )
    }
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer ce produit ?"))) return

    await apiDelete(`/admin/products/${id}`)

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
          Produits boutique
        </h1>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", marginRight: 12 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            style={{ ...inputStyle, width: 180 }}
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{ ...inputStyle, width: "auto" }}
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            setEditingId("new")
            setError(null)
            setForm({ ...emptyForm, category: categories[0]?.name ?? "Livres" })
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
          + Ajouter un produit
        </button>
      </div>

      {/* Categories (Livres, Bibles, Missels…) */}
      <div
        style={{
          background: "#E8F2FF",
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
          fontSize: "0.85rem",
        }}
      >
        <strong style={{ color: "#0B3D91" }}>Catégories :</strong>{" "}
        <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, verticalAlign: "middle" }}>
          {categories.map((c) => (
            <span
              key={c.id}
              style={{
                background: "#fff",
                border: "1px solid #c7d7f0",
                borderRadius: 20,
                padding: "3px 4px 3px 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {c.name}
              <span style={{ color: "#6b7280", fontSize: "0.72rem" }}>
                ({rows.filter((r) => r.category === c.name).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setCatEditingId(c.id)
                  setCatName(c.name)
                }}
                style={{ ...linkBtn, padding: "0 4px" }}
                title="Renommer"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => removeCategory(c)}
                style={{ ...linkBtn, padding: "0 6px", color: "#b91c1c" }}
                title="Supprimer"
              >
                ×
              </button>
            </span>
          ))}
        </span>
        <form onSubmit={saveCategory} style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <input
            required
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder={catEditingId ? "Nouveau nom" : "Nouvelle catégorie (ex. Bibles)"}
            style={{ ...inputStyle, width: 240 }}
          />
          <button
            type="submit"
            style={{
              background: "#0B3D91",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {catEditingId ? "Renommer" : "+ Ajouter"}
          </button>
          {catEditingId && (
            <button
              type="button"
              onClick={() => {
                setCatEditingId(null)
                setCatName("")
              }}
              style={linkBtn}
            >
              Annuler
            </button>
          )}
          {catError && <span style={{ color: "#b91c1c" }}>{catError}</span>}
        </form>
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
            maxWidth: 560,
          }}
        >
          <Field label="Nom">
            <input
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginTop: 8,
            }}
          >
            <Field label="Prix (FCFA)">
              <input
                type="number"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="Prix barré">
              <input
                type="number"
                value={form.prix_barre}
                onChange={(e) =>
                  setForm({ ...form, prix_barre: e.target.value })
                }
                style={inputStyle}
              />
            </Field>
            <Field label="Catégorie">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                {!categories.some((c) => c.name === form.category) && (
                  <option value={form.category}>{form.category || "—"}</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              style={{ ...inputStyle, marginTop: 8 }}
            />
          </Field>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            <ImageUpload
              label="Image principale"
              folder="products"
              value={form.img}
              height={150}
              onChange={(img) => setForm({ ...form, img })}
            />
            {[0, 1].map((i) => (
              <div key={i}>
                <ImageUpload
                  label={`Image ${i + 2} (facultatif)`}
                  folder="products"
                  value={form.images[i] ?? ""}
                  height={150}
                  onChange={(path) => {
                    const images = [...form.images]
                    images[i] = path
                    setForm({ ...form, images })
                  }}
                />
                {form.images[i] && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: form.images.filter((_, j) => j !== i),
                      })
                    }
                    style={{ ...linkBtn, color: "#b91c1c", marginTop: 4 }}
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 4 }}>
            Format conseillé : portrait 2:3 (ex. 400×600 px), affiché en 200×300 sur le site.
          </p>
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: "0.83rem",
                marginTop: 10,
              }}
            >
              {error}
            </div>
          )}
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
            <th style={th}>Image</th>
            <th style={th}>Produit</th>
            <th style={th}>Catégorie</th>
            <th style={th}>Prix</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows
            .filter(
              (r) =>
                (!filterCat || r.category === filterCat) &&
                (!q || r.nom.toLowerCase().includes(q.toLowerCase())),
            )
            .map((r) => (
            <tr
              key={r.id}
              style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}
            >
              <td style={td}>
                <Thumb path={r.img} />
              </td>
              <td style={td}>{r.nom}</td>
              <td style={td}>{r.category}</td>
              <td style={td}>{r.prix.toLocaleString("fr-FR")} FCFA</td>
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
