import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface Row {
  id: number;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string;
  tranche_age: string | null;
  quartier: string | null;
  membre_cev: boolean;
  quelle_cev: string | null;
  membre_groupe: boolean;
  quel_groupe: string | null;
  anciennete: string | null;
  source: "public" | "admin";
  created_at: string;
}

const emptyForm = {
  nom: "", prenom: "", email: "", telephone: "", tranche_age: "", rue: "", quartier: "", lieu_dit: "",
  membre_cev: false, quelle_cev: "", membre_groupe: false, quel_groupe: "", anciennete: "",
};

export default function AdminRegistre() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function load(query = "") {
    apiGet<Row[]>(`/admin/registre${query ? `?q=${encodeURIComponent(query)}` : ""}`).then(setRows);
  }

  useEffect(() => load(), []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await apiPost("/admin/registre", form);
    setShowForm(false);
    setForm(emptyForm);
    load(q);
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cette inscription ?")) return;
    await apiDelete(`/admin/registre/${id}`);
    load(q);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Registre paroissial</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Inscrire quelqu'un
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Nom"><input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} /></Field>
            <Field label="Prénom"><input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} style={inputStyle} /></Field>
            <Field label="Téléphone"><input required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} style={inputStyle} /></Field>
            <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} /></Field>
            <Field label="Tranche d'âge"><input value={form.tranche_age} onChange={(e) => setForm({ ...form, tranche_age: e.target.value })} placeholder="25-64" style={inputStyle} /></Field>
            <Field label="Quartier"><input value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} style={inputStyle} /></Field>
            <Field label="Ancienneté"><input value={form.anciennete} onChange={(e) => setForm({ ...form, anciennete: e.target.value })} style={inputStyle} /></Field>
            <Field label="Quel groupe (si membre)"><input value={form.quel_groupe} onChange={(e) => setForm({ ...form, quel_groupe: e.target.value, membre_groupe: !!e.target.value })} style={inputStyle} /></Field>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); load(e.target.value); }}
          placeholder="Rechercher par nom, prénom, téléphone..."
          style={{ ...inputStyle, maxWidth: 340 }}
        />
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Nom</th><th style={th}>Contact</th><th style={th}>Quartier</th><th style={th}>Groupe</th><th style={th}>Source</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.prenom} {r.nom}</td>
              <td style={td}>{r.telephone}{r.email ? ` · ${r.email}` : ""}</td>
              <td style={td}>{r.quartier || "—"}</td>
              <td style={td}>{r.quel_groupe || (r.membre_cev ? r.quelle_cev : "—") || "—"}</td>
              <td style={td}>{r.source === "admin" ? "Admin" : "Public"}</td>
              <td style={td}>
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
