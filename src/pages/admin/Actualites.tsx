import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import type { NewsArticle, NewsCategory } from "@/lib/content-types";
import ImageUpload, { Thumb } from "./ImageUpload";

const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const emptyForm = {
  news_category_id: "" as string, title: "", excerpt: "", content: "", img: "",
  published_at: nowLocal(), is_published: true,
};

const emptyCat = { name: "", color: "#0B3D91" };

export default function AdminActualites() {
  const [rows, setRows] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  const [catEditingId, setCatEditingId] = useState<number | "new" | null>(null);
  const [catForm, setCatForm] = useState(emptyCat);
  const [catError, setCatError] = useState<string | null>(null);

  function load() {
    apiGet<NewsArticle[]>("/admin/news").then(setRows);
    apiGet<NewsCategory[]>("/news-categories").then(setCategories);
  }

  useEffect(load, []);

  function startEdit(n: NewsArticle) {
    setEditingId(n.id);
    setError(null);
    setForm({
      news_category_id: n.news_category_id ? String(n.news_category_id) : "",
      title: n.title, excerpt: n.excerpt || "", content: n.content || "", img: n.img || "",
      published_at: n.published_at.slice(0, 16), is_published: n.is_published,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, news_category_id: form.news_category_id ? Number(form.news_category_id) : null };
    try {
      if (editingId === "new") await apiPost("/admin/news", payload);
      else if (editingId) await apiPut(`/admin/news/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer cette actualité ?"))) return;
    await apiDelete(`/admin/news/${id}`);
    load();
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError(null);
    try {
      if (catEditingId === "new") await apiPost("/admin/news-categories", { ...catForm, sort_order: categories.length });
      else if (catEditingId) {
        const current = categories.find((c) => c.id === catEditingId);
        await apiPut(`/admin/news-categories/${catEditingId}`, { ...catForm, sort_order: current?.sort_order ?? 0 });
      }
      setCatEditingId(null);
      load();
    } catch (err) {
      setCatError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function removeCategory(c: NewsCategory) {
    const count = rows.filter((r) => r.news_category_id === c.id).length;
    const msg = count
      ? `Supprimer la catégorie « ${c.name} » ? Ses ${count} article(s) seront conservés sans catégorie.`
      : `Supprimer la catégorie « ${c.name} » ?`;
    if (!(await confirmDialog({ title: "Supprimer la catégorie", message: msg }))) return;
    await apiDelete(`/admin/news-categories/${c.id}`);
    if (filter === String(c.id)) setFilter("");
    load();
  }

  const visible = filter ? rows.filter((r) => String(r.news_category_id) === filter) : rows;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Actualités</h1>
        <button onClick={() => { setEditingId("new"); setForm({ ...emptyForm, published_at: nowLocal() }); setError(null); }} style={primaryBtn}>
          + Ajouter une actualité
        </button>
      </div>

      {/* Catégories */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1c2340" }}>Catégories</h2>
          <button onClick={() => { setCatEditingId("new"); setCatForm(emptyCat); setCatError(null); }} style={linkBtn}>+ Nouvelle catégorie</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e5e7eb", borderRadius: 999, padding: "4px 6px 4px 10px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
              <span style={{ fontSize: "0.82rem" }}>{c.name}</span>
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>({rows.filter((r) => r.news_category_id === c.id).length})</span>
              <button onClick={() => { setCatEditingId(c.id); setCatForm({ name: c.name, color: c.color }); setCatError(null); }} style={{ ...linkBtn, marginRight: 0 }}>✎</button>
              <button onClick={() => removeCategory(c)} style={{ ...linkBtn, marginRight: 0, color: "#b91c1c" }}>✕</button>
            </div>
          ))}
          {categories.length === 0 && <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Aucune catégorie.</span>}
        </div>
        {catEditingId !== null && (
          <form onSubmit={saveCategory} className="flex flex-wrap items-end gap-3 mt-4">
            <Field label="Nom"><input required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} style={inputStyle} /></Field>
            <Field label="Couleur"><input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} style={{ width: 48, height: 36, border: "1px solid #e5e7eb", borderRadius: 6 }} /></Field>
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setCatEditingId(null)} style={secondaryBtn}>Annuler</button>
            {catError && <span style={{ fontSize: "0.8rem", color: "#b91c1c" }}>{catError}</span>}
          </form>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Titre"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} /></Field>
            </div>
            <Field label="Catégorie">
              <select value={form.news_category_id} onChange={(e) => setForm({ ...form, news_category_id: e.target.value })} style={inputStyle}>
                <option value="">— Sans catégorie —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Date de publication"><input type="datetime-local" required value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} style={inputStyle} /></Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <ImageUpload folder="news" value={form.img} onChange={(img) => setForm({ ...form, img })} />
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Chapeau (résumé affiché dans les listes)"><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} style={inputStyle} /></Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Contenu"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} style={inputStyle} /></Field>
          </div>
          <label className="flex items-center gap-2 mt-3" style={{ fontSize: "0.85rem" }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Publiée
          </label>
          {error && <p style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: 8 }}>{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>Annuler</button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Filtrer :</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Image</th><th style={th}>Titre</th><th style={th}>Catégorie</th><th style={th}>Date</th><th style={th}>Publiée</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}><Thumb path={r.img} /></td>
              <td style={td}>{r.title}</td>
              <td style={td}>
                {r.category ? (
                  <span style={{ background: r.category.color, color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{r.category.name}</span>
                ) : <span style={{ color: "#9ca3af" }}>—</span>}
              </td>
              <td style={td}>{new Date(r.published_at).toLocaleDateString("fr-FR")}</td>
              <td style={td}>{r.is_published ? "Oui" : "Non"}</td>
              <td style={td}>
                <button onClick={() => startEdit(r)} style={linkBtn}>Modifier</button>
                <button onClick={() => remove(r.id)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: "0.85rem" };
const primaryBtn: React.CSSProperties = { background: "#0B3D91", color: "#fff", padding: "8px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" };
const secondaryBtn: React.CSSProperties = { background: "none", border: "1px solid #e5e7eb", padding: "8px 18px", borderRadius: 8, cursor: "pointer" };
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "middle" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
