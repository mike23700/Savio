import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Photo {
  id: number;
  url: string;
}

interface Row {
  id: number;
  titre: string;
  description: string;
  statut: "en_cours" | "termine";
  objectif: number;
  collecte: number;
  image: string;
  details: string;
  photos_count?: number;
}

interface ProjetForm {
  titre: string;
  description: string;
  statut: "en_cours" | "termine";
  objectif: string;
  collecte: string;
  image: string;
  details: string;
}

const emptyForm: ProjetForm = { titre: "", description: "", statut: "en_cours", objectif: "0", collecte: "0", image: "", details: "" };

export default function AdminProjets() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoManagerId, setPhotoManagerId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  function load() {
    apiGet<Row[]>("/admin/projets").then(setRows);
  }

  useEffect(load, []);

  function startEdit(r: Row) {
    setEditingId(r.id);
    setForm({
      titre: r.titre, description: r.description || "", statut: r.statut,
      objectif: String(r.objectif), collecte: String(r.collecte), image: r.image || "", details: r.details || "",
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, objectif: parseFloat(form.objectif) || 0, collecte: parseFloat(form.collecte) || 0 };
    if (editingId === "new") await apiPost("/admin/projets", payload);
    else if (editingId) await apiPut(`/admin/projets/${editingId}`, payload);
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce projet ?")) return;
    await apiDelete(`/admin/projets/${id}`);
    load();
  }

  async function openPhotoManager(id: number) {
    setPhotoManagerId(id);
    const data = await apiGet<{ photos: Photo[] }>(`/projets/${id}`);
    setPhotos(data.photos);
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files || !photoManagerId) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("photos[]", f));
    const created = await apiPost<Photo[]>(`/admin/projets/${photoManagerId}/photos`, fd);
    setPhotos([...photos, ...created]);
    load();
  }

  async function removePhoto(photoId: number) {
    if (!photoManagerId) return;
    await apiDelete(`/admin/projets/${photoManagerId}/photos/${photoId}`);
    setPhotos(photos.filter((p) => p.id !== photoId));
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Projets paroissiaux</h1>
        <button onClick={() => { setEditingId("new"); setForm(emptyForm); }} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter un projet
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <Field label="Titre"><input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} style={inputStyle} /></Field>
          <Field label="Description courte"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <Field label="Description détaillée"><textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={4} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            <Field label="Statut">
              <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as "en_cours" | "termine" })} style={inputStyle}>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </Field>
            <Field label="Objectif (FCFA)"><input type="number" value={form.objectif} onChange={(e) => setForm({ ...form, objectif: e.target.value })} style={inputStyle} /></Field>
            <Field label="Collecté (FCFA)"><input type="number" value={form.collecte} onChange={(e) => setForm({ ...form, collecte: e.target.value })} style={inputStyle} /></Field>
          </div>
          <Field label="Image de couverture (URL)"><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
          </div>
        </form>
      )}

      {photoManagerId !== null && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 640 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: "#1c2340" }}>Photos supplémentaires</h3>
            <button onClick={() => setPhotoManagerId(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", color: "#6b7280" }}>Fermer</button>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {photos.map((p) => (
              <div key={p.id} className="relative">
                <img src={p.url} alt="" style={{ width: 90, height: 70, objectFit: "cover", borderRadius: 8 }} />
                <button onClick={() => removePhoto(p.id)} style={{ position: "absolute", top: -6, right: -6, background: "#b91c1c", color: "#fff", borderRadius: "50%", width: 20, height: 20, border: "none", cursor: "pointer", fontSize: "0.7rem" }}>✕</button>
              </div>
            ))}
          </div>
          <input ref={fileInput} type="file" multiple accept="image/*" onChange={(e) => uploadPhotos(e.target.files)} />
        </div>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Titre</th><th style={th}>Statut</th><th style={th}>Collecte / Objectif</th><th style={th}>Photos</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.titre}</td>
              <td style={td}>{r.statut === "termine" ? "Terminé" : "En cours"}</td>
              <td style={td}>{r.collecte.toLocaleString("fr-FR")} / {r.objectif.toLocaleString("fr-FR")} FCFA</td>
              <td style={td}>{r.photos_count ?? 0}</td>
              <td style={td}>
                <button onClick={() => startEdit(r)} style={linkBtn}>Modifier</button>
                <button onClick={() => openPhotoManager(r.id)} style={linkBtn}>Photos</button>
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
