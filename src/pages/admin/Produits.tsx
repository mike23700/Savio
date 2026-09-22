import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Row {
  id: number;
  nom: string;
  prix: number;
  prix_barre: number | null;
  category: string;
  img: string;
  description: string;
  is_active: boolean;
}

const emptyForm = { nom: "", prix: "0", prix_barre: "", category: "Livres", img: "", description: "", is_active: true };

export default function AdminProduits() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Row[]>("/admin/products").then(setRows);
  }

  useEffect(load, []);

  function startEdit(r: Row) {
    setEditingId(r.id);
    setForm({
      nom: r.nom, prix: String(r.prix), prix_barre: r.prix_barre ? String(r.prix_barre) : "",
      category: r.category, img: r.img || "", description: r.description || "", is_active: r.is_active,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      prix: parseFloat(form.prix) || 0,
      prix_barre: form.prix_barre ? parseFloat(form.prix_barre) : null,
    };
    if (editingId === "new") await apiPost("/admin/products", payload);
    else if (editingId) await apiPut(`/admin/products/${editingId}`, payload);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce produit ?")) return;
    await apiDelete(`/admin/products/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Produits boutique</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter un produit
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 560 }}>
          <Field label="Nom"><input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            <Field label="Prix (FCFA)"><input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} style={inputStyle} /></Field>
            <Field label="Prix barré"><input type="number" value={form.prix_barre} onChange={(e) => setForm({ ...form, prix_barre: e.target.value })} style={inputStyle} /></Field>
            <Field label="Catégorie">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="Livres">Livres</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Image (URL)"><input value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Produit</th><th style={th}>Catégorie</th><th style={th}>Prix</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.nom}</td>
              <td style={td}>{r.category}</td>
              <td style={td}>{r.prix.toLocaleString("fr-FR")} FCFA</td>
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
