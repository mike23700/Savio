import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface SacrementRow {
  id: number;
  slug: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  sort_order: number;
  is_active: boolean;
  details: { id: number; detail: string }[];
}

const emptyForm = { icon: "", title: "", subtitle: "", description: "", img: "", details: "" };

export default function AdminSacrements() {
  const [rows, setRows] = useState<SacrementRow[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<SacrementRow[]>("/admin/sacrements").then(setRows);
  }

  useEffect(load, []);

  function startEdit(row: SacrementRow) {
    setEditingId(row.id);
    setForm({
      icon: row.icon,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      img: row.img,
      details: row.details.map((d) => d.detail).join("\n"),
    });
  }

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      icon: form.icon,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      img: form.img,
      details: form.details.split("\n").map((d) => d.trim()).filter(Boolean),
    };
    if (editingId === "new") {
      await apiPost("/admin/sacrements", payload);
    } else if (editingId) {
      await apiPut(`/admin/sacrements/${editingId}`, payload);
    }
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce sacrement ?")) return;
    await apiDelete(`/admin/sacrements/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Sacrements</h1>
        <button onClick={startNew} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Icône (emoji)">
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Titre">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </Field>
          </div>
          <Field label="Sous-titre">
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, marginTop: 8 }} />
          </Field>
          <Field label="Image (URL)">
            <input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} />
          </Field>
          <Field label="Informations pratiques (une par ligne)">
            <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={4} style={{ ...inputStyle, marginTop: 8 }} />
          </Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
              Enregistrer
            </button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Sacrement</th>
            <th style={th}>Sous-titre</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.icon} {r.title}</td>
              <td style={td}>{r.subtitle}</td>
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
