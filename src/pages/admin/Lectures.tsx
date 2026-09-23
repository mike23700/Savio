import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError, localDateISO } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import type { DailyReadings } from "@/lib/content-types";

interface Row {
  id: number;
  date: string;
  liturgical_day: string | null;
  reading_1: string | null;
  psalm: string | null;
  reading_2: string | null;
  gospel: string | null;
  gospel_title: string | null;
}

const emptyForm = { date: localDateISO(), liturgical_day: "", reading_1: "", psalm: "", reading_2: "", gospel: "", gospel_title: "" };

export default function AdminLectures() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<DailyReadings | null>(null);

  function load() {
    apiGet<Row[]>("/admin/lectures").then(setRows);
  }

  useEffect(() => {
    load();
    apiGet<DailyReadings | null>(`/lectures/jour?date=${localDateISO()}`).then(setPreview).catch(() => {});
  }, []);

  function startEdit(r: Row) {
    setEditingId(r.id);
    setError(null);
    setForm({
      date: r.date.slice(0, 10), liturgical_day: r.liturgical_day || "", reading_1: r.reading_1 || "", psalm: r.psalm || "",
      reading_2: r.reading_2 || "", gospel: r.gospel || "", gospel_title: r.gospel_title || "",
    });
  }

  /** Pre-fill the form with the official AELF readings for the chosen date. */
  async function prefillFromAelf() {
    const r = await apiGet<DailyReadings | null>(`/lectures/jour?date=${form.date}`).catch(() => null);
    if (!r) {
      setError("Aucune lecture trouvée pour cette date.");
      return;
    }
    setForm({
      ...form, liturgical_day: r.liturgical_day || "", reading_1: r.reading_1 || "", psalm: r.psalm || "",
      reading_2: r.reading_2 || "", gospel: r.gospel || "", gospel_title: r.gospel_title || "",
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId === "new") await apiPost("/admin/lectures", form);
      else if (editingId) await apiPut(`/admin/lectures/${editingId}`, form);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer ces lectures ? Les lectures officielles (AELF) seront de nouveau affichées pour ce jour."))) return;
    await apiDelete(`/admin/lectures/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Lectures du jour</h1>
        <button onClick={() => { setEditingId("new"); setForm({ ...emptyForm, date: localDateISO() }); setError(null); }} style={primaryBtn}>
          + Saisir des lectures
        </button>
      </div>
      <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 20, maxWidth: 720, lineHeight: 1.6 }}>
        Les lectures de chaque jour sont récupérées automatiquement depuis l'AELF (calendrier liturgique d'Afrique).
        Ajoutez une entrée ici uniquement pour remplacer les lectures d'un jour précis (fête patronale, célébration particulière…).
      </p>

      {preview && (
        <div style={{ background: "#E8F2FF", borderRadius: 12, padding: 16, marginBottom: 24, maxWidth: 720, fontSize: "0.82rem", color: "#1c2340" }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            Affiché aujourd'hui sur le site · source : {preview.source === "paroisse" ? "saisie paroisse" : "AELF"}
          </div>
          <div style={{ color: "#4b5563" }}>{preview.liturgical_day}</div>
          <div style={{ color: "#4b5563", marginTop: 4 }}>
            {[preview.reading_1, preview.psalm, preview.reading_2, preview.gospel].filter(Boolean).join(" · ")}
          </div>
        </div>
      )}

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date"><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} /></Field>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="button" onClick={prefillFromAelf} style={secondaryBtn}>Pré-remplir depuis l'AELF</button>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Jour liturgique (ex: 26e dimanche du Temps Ordinaire)"><input value={form.liturgical_day} onChange={(e) => setForm({ ...form, liturgical_day: e.target.value })} style={inputStyle} /></Field>
            </div>
            <Field label="1ère lecture (ex: Ez 18, 25-28)"><input value={form.reading_1} onChange={(e) => setForm({ ...form, reading_1: e.target.value })} style={inputStyle} /></Field>
            <Field label="Psaume (ex: Ps 24)"><input value={form.psalm} onChange={(e) => setForm({ ...form, psalm: e.target.value })} style={inputStyle} /></Field>
            <Field label="2ème lecture (ex: Ph 2, 1-11)"><input value={form.reading_2} onChange={(e) => setForm({ ...form, reading_2: e.target.value })} style={inputStyle} /></Field>
            <Field label="Évangile (ex: Mt 21, 28-32)"><input value={form.gospel} onChange={(e) => setForm({ ...form, gospel: e.target.value })} style={inputStyle} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Titre de l'Évangile (facultatif)"><input value={form.gospel_title} onChange={(e) => setForm({ ...form, gospel_title: e.target.value })} style={inputStyle} /></Field>
            </div>
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
            <th style={th}>Date</th><th style={th}>Jour liturgique</th><th style={th}>Lectures</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={4} style={{ ...td, color: "#9ca3af", fontSize: "0.85rem" }}>Aucune saisie : les lectures AELF sont utilisées tous les jours.</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{new Date(`${r.date.slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</td>
              <td style={td}>{r.liturgical_day}</td>
              <td style={td}>{[r.reading_1, r.psalm, r.reading_2, r.gospel].filter(Boolean).join(" · ")}</td>
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
const primaryBtn: React.CSSProperties = { background: "#0B3D91", color: "#fff", padding: "8px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" };
const secondaryBtn: React.CSSProperties = { background: "none", border: "1px solid #e5e7eb", padding: "8px 18px", borderRadius: 8, cursor: "pointer" };
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
