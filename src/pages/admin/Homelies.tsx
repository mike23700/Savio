import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Homelie {
  id: number;
  title: string;
  priest: string;
  readings: string;
  sunday: string;
  duration: string;
  excerpt: string;
  img: string;
  published_at: string;
  is_published: boolean;
}

const emptyForm = {
  title: "", priest: "Père Curé", readings: "", sunday: "", duration: "",
  excerpt: "", img: "", published_at: new Date().toISOString().slice(0, 16), is_published: true,
};

export default function AdminHomelies() {
  const [rows, setRows] = useState<Homelie[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Homelie[]>("/admin/homelies").then(setRows);
  }

  useEffect(load, []);

  function startEdit(h: Homelie) {
    setEditingId(h.id);
    setForm({
      title: h.title, priest: h.priest, readings: h.readings, sunday: h.sunday, duration: h.duration,
      excerpt: h.excerpt, img: h.img, published_at: h.published_at.slice(0, 16), is_published: h.is_published,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingId === "new") await apiPost("/admin/homelies", form);
    else if (editingId) await apiPut(`/admin/homelies/${editingId}`, form);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cette homélie ?")) return;
    await apiDelete(`/admin/homelies/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Homélies</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter une homélie
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Titre"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} /></Field>
            <Field label="Date de publication"><input type="datetime-local" required value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} style={inputStyle} /></Field>
            <Field label="Prêtre"><input value={form.priest} onChange={(e) => setForm({ ...form, priest: e.target.value })} style={inputStyle} /></Field>
            <Field label="Durée (ex: 18 min)"><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={inputStyle} /></Field>
            <Field label="Dimanche / fête"><input value={form.sunday} onChange={(e) => setForm({ ...form, sunday: e.target.value })} style={inputStyle} /></Field>
            <Field label="Lectures"><input value={form.readings} onChange={(e) => setForm({ ...form, readings: e.target.value })} style={inputStyle} /></Field>
          </div>
          <Field label="Extrait"><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Image (URL)"><input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <label className="flex items-center gap-2 mt-3" style={{ fontSize: "0.85rem" }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Publiée
          </label>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Titre</th><th style={th}>Date</th><th style={th}>Publiée</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.title}</td>
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
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
