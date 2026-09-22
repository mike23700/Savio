import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api";

interface Niveau {
  id: number;
  nom: string;
  age_label: string;
  icon: string;
  description: string;
  duree: string;
}

interface Inscription {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string | null;
  age: string | null;
  statut: string;
  niveau: { nom: string } | null;
  created_at: string;
}

const emptyForm = { nom: "", age_label: "", icon: "", description: "", duree: "" };

export default function AdminCatechese() {
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Niveau[]>("/admin/catechese/niveaux").then(setNiveaux);
    apiGet<Inscription[]>("/admin/catechese/inscriptions").then(setInscriptions);
  }

  useEffect(load, []);

  function startEdit(n: Niveau) {
    setEditingId(n.id);
    setForm({ nom: n.nom, age_label: n.age_label, icon: n.icon, description: n.description, duree: n.duree });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editingId === "new") await apiPost("/admin/catechese/niveaux", form);
    else if (editingId) await apiPut(`/admin/catechese/niveaux/${editingId}`, form);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce niveau ?")) return;
    await apiDelete(`/admin/catechese/niveaux/${id}`);
    load();
  }

  async function updateStatut(id: number, statut: string) {
    await apiPatch(`/admin/catechese/inscriptions/${id}`, { statut });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Catéchèse</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter un niveau
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 560 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Nom"><input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} /></Field>
            <Field label="Tranche d'âge"><input value={form.age_label} onChange={(e) => setForm({ ...form, age_label: e.target.value })} style={inputStyle} /></Field>
            <Field label="Icône"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle} /></Field>
            <Field label="Durée"><input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} style={inputStyle} /></Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Niveau</th><th style={th}>Âge</th><th style={th}>Durée</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {niveaux.map((n) => (
            <tr key={n.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{n.icon} {n.nom}</td>
              <td style={td}>{n.age_label}</td>
              <td style={td}>{n.duree}</td>
              <td style={td}>
                <button onClick={() => startEdit(n)} style={linkBtn}>Modifier</button>
                <button onClick={() => remove(n.id)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", color: "#1c2340", marginBottom: 12 }}>Inscriptions reçues</h2>
      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Nom</th><th style={th}>Contact</th><th style={th}>Niveau</th><th style={th}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.map((i) => (
            <tr key={i.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{i.prenom} {i.nom}</td>
              <td style={td}>{i.telephone}{i.email ? ` · ${i.email}` : ""}</td>
              <td style={td}>{i.niveau?.nom || "—"}</td>
              <td style={td}>
                <select value={i.statut} onChange={(e) => updateStatut(i.id, e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  <option value="en_attente">En attente</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="annulee">Annulée</option>
                </select>
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
