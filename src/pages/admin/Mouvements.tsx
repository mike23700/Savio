import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Row {
  id: number;
  category: string;
  icon: string;
  title: string;
  description: string;
  content: string;
  color: string;
  is_active: boolean;
  details: { id: number; detail: string }[];
}

const emptyForm = { category: "conseil", icon: "", title: "", description: "", content: "", color: "", details: "" };

export default function AdminMouvements() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Row[]>("/admin/mouvements").then(setRows);
  }

  useEffect(load, []);

  function startEdit(r: Row) {
    setEditingId(r.id);
    setForm({
      category: r.category, icon: r.icon, title: r.title, description: r.description || "",
      content: r.content || "", color: r.color || "", details: r.details.map((d) => d.detail).join("\n"),
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, details: form.details.split("\n").map((d) => d.trim()).filter(Boolean) };
    if (editingId === "new") await apiPost("/admin/mouvements", payload);
    else if (editingId) await apiPut(`/admin/mouvements/${editingId}`, payload);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cet élément ?")) return;
    await apiDelete(`/admin/mouvements/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Mouvements & Groupes</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Catégorie">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="conseil">Conseil</option>
                <option value="mouvement">Mouvement</option>
                <option value="chorale">Chorale</option>
                <option value="cev">CEV</option>
              </select>
            </Field>
            <Field label="Icône"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle} /></Field>
          </div>
          <Field label="Titre"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Description courte (carte)"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Contenu détaillé (page)"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Informations pratiques (une par ligne)"><textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={3} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Catégorie</th><th style={th}>Titre</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.category}</td>
              <td style={td}>{r.icon} {r.title}</td>
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
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
