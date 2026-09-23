import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import type { TeamMember } from "@/lib/content-types";
import ImageUpload, { Thumb } from "./ImageUpload";

const emptyForm = {
  name: "", role: "", photo: "", since: "", origin: "", bio: "", motto: "", email: "",
  born: "", ordained: "", ordained_by: "", ministries: "", sort_order: 0, is_active: true,
};

export default function AdminEquipe() {
  const [rows, setRows] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function load() {
    apiGet<TeamMember[]>("/admin/equipe").then(setRows);
  }

  useEffect(load, []);

  function startEdit(m: TeamMember) {
    setEditingId(m.id);
    setError(null);
    setForm({
      name: m.name, role: m.role, photo: m.photo || "", since: m.since || "", origin: m.origin || "", bio: m.bio || "",
      motto: m.motto || "", email: m.email || "", born: m.born || "", ordained: m.ordained || "",
      ordained_by: m.ordained_by || "", ministries: (m.ministries || []).join("\n"), sort_order: m.sort_order, is_active: m.is_active,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      email: form.email || null,
      ministries: form.ministries.split("\n").map((l) => l.trim()).filter(Boolean),
    };
    try {
      if (editingId === "new") await apiPost("/admin/equipe", payload);
      else if (editingId) await apiPut(`/admin/equipe/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(m: TeamMember) {
    if (!(await confirmDialog({ title: "Retirer de l'équipe", message: <>Retirer <strong>{m.name}</strong> de l'équipe pastorale ?</>, confirmLabel: "Retirer" }))) return;
    await apiDelete(`/admin/equipe/${m.id}`);
    load();
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Le Curé & l'équipe pastorale</h1>
        <button onClick={() => { setEditingId("new"); setForm({ ...emptyForm, sort_order: rows.length }); setError(null); }} style={primaryBtn}>
          + Ajouter un membre
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 720 }}>
          <ImageUpload label="Photo" folder="team" value={form.photo} onChange={(photo) => setForm({ ...form, photo })} height={160} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Field label="Nom complet"><input required value={form.name} onChange={set("name")} style={inputStyle} /></Field>
            <Field label="Fonction (ex: Curé de la paroisse)"><input required value={form.role} onChange={set("role")} style={inputStyle} /></Field>
            <Field label="En poste depuis"><input value={form.since} onChange={set("since")} style={inputStyle} /></Field>
            <Field label="Origine / diocèse"><input value={form.origin} onChange={set("origin")} style={inputStyle} /></Field>
            <Field label="Né le"><input value={form.born} onChange={set("born")} style={inputStyle} /></Field>
            <Field label="Ordonné le"><input value={form.ordained} onChange={set("ordained")} style={inputStyle} /></Field>
            <Field label="Ordonné par"><input value={form.ordained_by} onChange={set("ordained_by")} style={inputStyle} /></Field>
            <Field label="E-mail"><input type="email" value={form.email} onChange={set("email")} style={inputStyle} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Devise"><input value={form.motto} onChange={set("motto")} style={inputStyle} /></Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Biographie"><textarea value={form.bio} onChange={set("bio")} rows={5} style={inputStyle} /></Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Ministères exercés (un par ligne, du plus ancien au plus récent)"><textarea value={form.ministries} onChange={set("ministries")} rows={4} style={inputStyle} /></Field>
            </div>
            <Field label="Ordre d'affichage">
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle} />
            </Field>
            <label className="flex items-center gap-2" style={{ fontSize: "0.85rem", alignSelf: "end", paddingBottom: 8 }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Affiché sur le site
            </label>
          </div>
          {error && <p style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: 8 }}>{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>Annuler</button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Ordre</th><th style={th}>Photo</th><th style={th}>Nom</th><th style={th}>Fonction</th><th style={th}>Affiché</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.sort_order}</td>
              <td style={td}><Thumb path={r.photo} size={52} /></td>
              <td style={td}>{r.name}</td>
              <td style={td}>{r.role}</td>
              <td style={td}>{r.is_active ? "Oui" : "Non"}</td>
              <td style={td}>
                <button onClick={() => startEdit(r)} style={linkBtn}>Modifier</button>
                <button onClick={() => remove(r)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
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
