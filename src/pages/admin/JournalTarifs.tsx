import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Tarif {
  id: number;
  label: string;
  price_label: string;
  issues: number;
  period: string;
}

const emptyForm = { label: "", price_label: "", issues: "4", period: "" };

export default function AdminJournalTarifs() {
  const [rows, setRows] = useState<Tarif[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Tarif[]>("/admin/journal/tarifs").then(setRows);
  }

  useEffect(load, []);

  function startEdit(t: Tarif) {
    setEditingId(t.id);
    setForm({ label: t.label, price_label: t.price_label, issues: String(t.issues), period: t.period });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, issues: parseInt(form.issues, 10) || 1 };
    if (editingId === "new") await apiPost("/admin/journal/tarifs", payload);
    else if (editingId) await apiPut(`/admin/journal/tarifs/${editingId}`, payload);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce tarif ?")) return;
    await apiDelete(`/admin/journal/tarifs/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Tarifs du journal</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter un tarif
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 520 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Libellé (ex: Mensuel)"><input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} style={inputStyle} /></Field>
            <Field label="Prix affiché (ex: 500 FCFA)"><input required value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} style={inputStyle} /></Field>
            <Field label="Nombre de numéros"><input type="number" value={form.issues} onChange={(e) => setForm({ ...form, issues: e.target.value })} style={inputStyle} /></Field>
            <Field label="Période (ex: 1 mois)"><input required value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} style={inputStyle} /></Field>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Libellé</th><th style={th}>Prix</th><th style={th}>Période</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.label}</td>
              <td style={td}>{r.price_label}</td>
              <td style={td}>{r.period}</td>
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
