import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "@/lib/api";
import { ESPACE_KIND, formatFcfa, type Espace } from "@/lib/content-types";
import { confirmDialog } from "./ConfirmDialog";
import ImageUpload, { Thumb } from "./ImageUpload";

type Row = Espace & { reservations_count: number };

const emptyForm = {
  kind: "chambre" as Espace["kind"], nom: "", resume: "", description: "", capacite: "", quantite: "1", prix: "",
  equipements: "", photos: [] as string[], is_active: true, sort_order: "0",
};

export default function AdminEspaces() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function load() {
    apiGet<Row[]>("/admin/espaces").then(setRows);
  }

  useEffect(load, []);

  function startNew(kind: Espace["kind"]) {
    setEditingId("new");
    setError(null);
    setForm({ ...emptyForm, kind });
  }

  function startEdit(r: Row) {
    setEditingId(r.id);
    setError(null);
    setForm({
      kind: r.kind, nom: r.nom, resume: r.resume || "", description: r.description || "",
      capacite: r.capacite ? String(r.capacite) : "", quantite: String(r.quantite), prix: r.prix ? String(r.prix) : "",
      equipements: (r.equipements || []).join("\n"), photos: r.photos || [], is_active: r.is_active, sort_order: String(r.sort_order),
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      capacite: form.capacite ? parseInt(form.capacite, 10) : null,
      quantite: parseInt(form.quantite, 10) || 1,
      prix: form.prix ? parseFloat(form.prix) : null,
      equipements: form.equipements.split("\n").map((s) => s.trim()).filter(Boolean),
      photos: form.photos.filter(Boolean),
      sort_order: parseInt(form.sort_order, 10) || 0,
    };
    try {
      if (editingId === "new") await apiPost("/admin/espaces", payload);
      else if (editingId) await apiPut(`/admin/espaces/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(r: Row) {
    if (!(await confirmDialog(`Supprimer « ${r.nom} » ?`))) return;
    try {
      await apiDelete(`/admin/espaces/${r.id}`);
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Suppression impossible.");
    }
  }

  const unit = ESPACE_KIND[form.kind].unit;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Chambres & salles</h1>
        <div className="flex gap-2">
          <button onClick={() => startNew("chambre")} style={primaryBtn}>+ Chambre</button>
          <button onClick={() => startNew("salle")} style={primaryBtn}>+ Salle</button>
        </div>
      </div>
      <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 20, maxWidth: 760, lineHeight: 1.6 }}>
        Les chambres du centre d'accueil sont facturées à la nuit, les salles à la journée. Laissez le prix vide pour un tarif « sur devis » :
        le visiteur envoie alors une demande sans paiement en ligne. La quantité indique combien d'unités identiques peuvent être réservées aux mêmes dates.
      </p>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <Field label="Type">
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Espace["kind"] })} style={inputStyle}>
                <option value="chambre">Chambre (centre d'accueil)</option>
                <option value="salle">Salle à louer</option>
              </select>
            </Field>
            <Field label="Nom"><input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            <Field label={`Prix / ${unit} (FCFA, vide = sur devis)`}><input type="number" min={0} value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} style={inputStyle} /></Field>
            <Field label={form.kind === "chambre" ? "Personnes / chambre" : "Capacité (pers.)"}><input type="number" min={1} value={form.capacite} onChange={(e) => setForm({ ...form, capacite: e.target.value })} style={inputStyle} /></Field>
            <Field label="Quantité (unités identiques)"><input type="number" min={1} required value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} style={inputStyle} /></Field>
            <Field label="Ordre d'affichage"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} style={inputStyle} /></Field>
          </div>
          <div style={{ marginTop: 8 }}>
            <Field label="Résumé (affiché sur la carte)"><input maxLength={255} value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} style={inputStyle} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 8 }}>
            <Field label="Description"><textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} /></Field>
            <Field label="Équipements (un par ligne)"><textarea rows={6} value={form.equipements} onChange={(e) => setForm({ ...form, equipements: e.target.value })} style={inputStyle} /></Field>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }}>Photos (la première sert de couverture)</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {form.photos.map((p, i) => (
                <div key={i}>
                  <ImageUpload label={`Photo ${i + 1}`} folder="espaces" height={110} value={p}
                    onChange={(path) => setForm({ ...form, photos: form.photos.map((x, j) => (j === i ? path : x)) })} />
                  <button type="button" onClick={() => setForm({ ...form, photos: form.photos.filter((_, j) => j !== i) })} style={{ ...linkBtn, color: "#b91c1c" }}>Retirer</button>
                </div>
              ))}
            </div>
            {form.photos.length < 12 && (
              <button type="button" onClick={() => setForm({ ...form, photos: [...form.photos, ""] })} style={{ ...secondaryBtn, marginTop: 8 }}>+ Ajouter une photo</button>
            )}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: "0.85rem" }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Proposé à la réservation sur le site
          </label>
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
            <th style={th}>Photo</th><th style={th}>Nom</th><th style={th}>Type</th><th style={th}>Tarif</th><th style={th}>Capacité</th><th style={th}>Qté</th><th style={th}>Statut</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={8} style={{ ...td, color: "#9ca3af", fontSize: "0.85rem" }}>Aucune chambre ni salle pour le moment.</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}><Thumb path={r.photos?.[0] ?? null} /></td>
              <td style={td}>{r.nom}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{r.reservations_count} réservation(s)</span></td>
              <td style={td}>{r.kind === "chambre" ? "Chambre" : "Salle"}</td>
              <td style={td}>{r.prix ? `${formatFcfa(r.prix)} / ${ESPACE_KIND[r.kind].unit}` : "Sur devis"}</td>
              <td style={td}>{r.capacite ?? "—"}</td>
              <td style={td}>{r.quantite}</td>
              <td style={td}>{r.is_active ? <span style={{ color: "#16a34a", fontWeight: 700 }}>En ligne</span> : <span style={{ color: "#9ca3af" }}>Masqué</span>}</td>
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
const td: React.CSSProperties = { padding: "10px 14px" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
