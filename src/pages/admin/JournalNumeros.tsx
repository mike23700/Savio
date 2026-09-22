import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Issue {
  id: number;
  numero: string;
  theme: string;
  published_at: string;
  pdf_url: string | null;
}

const emptyForm = { numero: "", theme: "", published_at: new Date().toISOString().slice(0, 10), pdf_url: "" };

export default function AdminJournalNumeros() {
  const [rows, setRows] = useState<Issue[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Issue[]>("/admin/journal/issues").then(setRows);
  }

  useEffect(load, []);

  function startEdit(i: Issue) {
    setEditingId(i.id);
    setForm({ numero: i.numero, theme: i.theme || "", published_at: i.published_at, pdf_url: i.pdf_url || "" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingId === "new") await apiPost("/admin/journal/issues", form);
    else if (editingId) await apiPut(`/admin/journal/issues/${editingId}`, form);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce numéro ?")) return;
    await apiDelete(`/admin/journal/issues/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Numéros du journal</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter un numéro
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 520 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Numéro (ex: N°39)"><input required value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} style={inputStyle} /></Field>
            <Field label="Date de publication"><input type="date" required value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} style={inputStyle} /></Field>
          </div>
          <Field label="Thème"><input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Lien PDF (optionnel)"><input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Numéro</th><th style={th}>Thème</th><th style={th}>Date</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.numero}</td>
              <td style={td}>{r.theme}</td>
              <td style={td}>{new Date(r.published_at).toLocaleDateString("fr-FR")}</td>
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
