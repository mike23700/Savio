import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError, localDateISO } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import { formatEventTime, type EventCategory, type ParishEvent } from "@/lib/content-types";

const emptyForm = { event_category_id: "", title: "", date: localDateISO(), time: "", location: "Église principale", description: "", is_published: true };
const emptyCat = { name: "", color: "#0B3D91" };

export default function AdminAgenda() {
  const [rows, setRows] = useState<ParishEvent[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [period, setPeriod] = useState<"upcoming" | "past" | "all">("upcoming");

  const [catEditingId, setCatEditingId] = useState<number | "new" | null>(null);
  const [catForm, setCatForm] = useState(emptyCat);
  const [catError, setCatError] = useState<string | null>(null);

  function load() {
    apiGet<ParishEvent[]>("/admin/events").then(setRows);
    apiGet<EventCategory[]>("/event-categories").then(setCategories);
  }

  useEffect(load, []);

  function startEdit(ev: ParishEvent) {
    setEditingId(ev.id);
    setError(null);
    setForm({
      event_category_id: ev.event_category_id ? String(ev.event_category_id) : "", title: ev.title,
      date: ev.date.slice(0, 10), time: ev.time ? ev.time.slice(0, 5) : "", location: ev.location || "",
      description: ev.description || "", is_published: ev.is_published,
    });
  }

  /** Pre-fill a new event from an existing one (e.g. a recurring meeting). */
  function duplicate(ev: ParishEvent) {
    startEdit(ev);
    setEditingId("new");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      event_category_id: form.event_category_id ? Number(form.event_category_id) : null,
      time: form.time || null,
    };
    try {
      if (editingId === "new") await apiPost("/admin/events", payload);
      else if (editingId) await apiPut(`/admin/events/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(id: number) {
    if (!(await confirmDialog("Supprimer cet événement ?"))) return;
    await apiDelete(`/admin/events/${id}`);
    load();
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError(null);
    try {
      if (catEditingId === "new") await apiPost("/admin/event-categories", { ...catForm, sort_order: categories.length });
      else if (catEditingId) {
        const current = categories.find((c) => c.id === catEditingId);
        await apiPut(`/admin/event-categories/${catEditingId}`, { ...catForm, sort_order: current?.sort_order ?? 0 });
      }
      setCatEditingId(null);
      load();
    } catch (err) {
      setCatError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function removeCategory(c: EventCategory) {
    if (!(await confirmDialog({ title: "Supprimer la catégorie", message: <>Supprimer la catégorie <strong>{c.name}</strong> ? Ses événements seront conservés, sans catégorie.</> }))) return;
    await apiDelete(`/admin/event-categories/${c.id}`);
    if (filter === String(c.id)) setFilter("");
    load();
  }

  const today = localDateISO();
  const visible = rows
    .filter((r) => !filter || String(r.event_category_id) === filter)
    .filter((r) => period === "all" || (period === "upcoming" ? r.date.slice(0, 10) >= today : r.date.slice(0, 10) < today))
    .sort((a, b) => {
      const ka = `${a.date.slice(0, 10)} ${a.time ?? ""}`;
      const kb = `${b.date.slice(0, 10)} ${b.time ?? ""}`;
      return period === "upcoming" ? ka.localeCompare(kb) : kb.localeCompare(ka);
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Agenda</h1>
        <button onClick={() => { setEditingId("new"); setForm({ ...emptyForm, date: localDateISO(), event_category_id: filter }); setError(null); }} style={primaryBtn}>
          + Ajouter un événement
        </button>
      </div>

      {/* Catégories */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1c2340" }}>Catégories</h2>
          <button onClick={() => { setCatEditingId("new"); setCatForm(emptyCat); setCatError(null); }} style={linkBtn}>+ Nouvelle catégorie</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e5e7eb", borderRadius: 999, padding: "4px 6px 4px 10px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
              <span style={{ fontSize: "0.82rem" }}>{c.name}</span>
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>({rows.filter((r) => r.event_category_id === c.id).length})</span>
              <button onClick={() => { setCatEditingId(c.id); setCatForm({ name: c.name, color: c.color }); setCatError(null); }} style={{ ...linkBtn, marginRight: 0 }}>✎</button>
              <button onClick={() => removeCategory(c)} style={{ ...linkBtn, marginRight: 0, color: "#b91c1c" }}>✕</button>
            </div>
          ))}
        </div>
        {catEditingId !== null && (
          <form onSubmit={saveCategory} className="flex flex-wrap items-end gap-3 mt-4">
            <Field label="Nom"><input required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} style={inputStyle} /></Field>
            <Field label="Couleur"><input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} style={{ width: 48, height: 36, border: "1px solid #e5e7eb", borderRadius: 6 }} /></Field>
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setCatEditingId(null)} style={secondaryBtn}>Annuler</button>
            {catError && <span style={{ fontSize: "0.8rem", color: "#b91c1c" }}>{catError}</span>}
          </form>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 720 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Titre"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} /></Field>
            </div>
            <Field label="Date"><input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} /></Field>
            <Field label="Heure"><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={inputStyle} /></Field>
            <Field label="Catégorie">
              <select value={form.event_category_id} onChange={(e) => setForm({ ...form, event_category_id: e.target.value })} style={inputStyle}>
                <option value="">— Sans catégorie —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Lieu"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Description (facultatif)"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={inputStyle} /></Field>
            </div>
          </div>
          <label className="flex items-center gap-2 mt-3" style={{ fontSize: "0.85rem" }}>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Publié sur le site
          </label>
          {error && <p style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: 8 }}>{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>Annuler</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(["upcoming", "past", "all"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: "6px 14px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: period === p ? "#0B3D91" : "#fff", color: period === p ? "#fff" : "#374151", border: `1px solid ${period === p ? "#0B3D91" : "#e5e7eb"}` }}>
            {p === "upcoming" ? "À venir" : p === "past" ? "Passés" : "Tous"}
          </button>
        ))}
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width: "auto", marginLeft: 8 }}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Date</th><th style={th}>Heure</th><th style={th}>Titre</th><th style={th}>Catégorie</th><th style={th}>Lieu</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr><td colSpan={6} style={{ ...td, color: "#9ca3af" }}>Aucun événement.</td></tr>
          )}
          {visible.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem", opacity: r.is_published ? 1 : 0.55 }}>
              <td style={td}>{new Date(`${r.date.slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</td>
              <td style={td}>{formatEventTime(r.time)}</td>
              <td style={td}>{r.title}</td>
              <td style={td}>
                {r.category ? (
                  <span style={{ background: r.category.color, color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{r.category.name}</span>
                ) : <span style={{ color: "#9ca3af" }}>—</span>}
              </td>
              <td style={td}>{r.location}</td>
              <td style={{ ...td, whiteSpace: "nowrap" }}>
                <button onClick={() => startEdit(r)} style={linkBtn}>Modifier</button>
                <button onClick={() => duplicate(r)} style={linkBtn}>Dupliquer</button>
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
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "middle" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
