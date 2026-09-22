import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Row {
  id: number;
  group_label: string;
  weekdays: number[] | null;
  recurrence_type: "weekly" | "monthly_nth_weekday" | "special";
  nth_week_of_month: number | null;
  time: string | null;
  time_label: string | null;
  type: string;
  note: string | null;
  counts_as_mass: boolean;
  sort_order: number;
  is_active: boolean;
}

const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const emptyForm = {
  group_label: "",
  weekdays: "" as string,
  recurrence_type: "weekly" as Row["recurrence_type"],
  nth_week_of_month: "" as string,
  time: "",
  time_label: "",
  type: "",
  note: "",
  counts_as_mass: true,
  sort_order: 0,
  is_active: true,
};

export default function AdminMassSchedule() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    apiGet<Row[]>("/admin/mass-schedule").then(setRows);
  }

  useEffect(load, []);

  function startEdit(row: Row) {
    setEditingId(row.id);
    setForm({
      group_label: row.group_label,
      weekdays: (row.weekdays || []).join(","),
      recurrence_type: row.recurrence_type,
      nth_week_of_month: row.nth_week_of_month?.toString() || "",
      time: row.time || "",
      time_label: row.time_label || "",
      type: row.type,
      note: row.note || "",
      counts_as_mass: row.counts_as_mass,
      sort_order: row.sort_order,
      is_active: row.is_active,
    });
  }

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      weekdays: form.weekdays ? form.weekdays.split(",").map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n)) : null,
      nth_week_of_month: form.nth_week_of_month ? parseInt(form.nth_week_of_month, 10) : null,
      time: form.time || null,
      time_label: form.time_label || null,
      note: form.note || null,
    };
    if (editingId === "new") {
      await apiPost("/admin/mass-schedule", payload);
    } else if (editingId) {
      await apiPut(`/admin/mass-schedule/${editingId}`, payload);
    }
    setEditingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Supprimer cette ligne d'horaire ?")) return;
    await apiDelete(`/admin/mass-schedule/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Horaires des messes</h1>
        <button onClick={startNew} style={{ background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Ajouter
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Libellé du groupe (ex: Dimanche)">
              <input required value={form.group_label} onChange={(e) => setForm({ ...form, group_label: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Type (ex: Messe principale)">
              <input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Récurrence">
              <select value={form.recurrence_type} onChange={(e) => setForm({ ...form, recurrence_type: e.target.value as Row["recurrence_type"] })} style={inputStyle}>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly_nth_weekday">Nième jour du mois</option>
                <option value="special">Spéciale (hors calcul)</option>
              </select>
            </Field>
            <Field label="Jours (0=Dim…6=Sam, séparés par virgule)">
              <input value={form.weekdays} onChange={(e) => setForm({ ...form, weekdays: e.target.value })} placeholder="1,2,3,4,5" style={inputStyle} />
            </Field>
            {form.recurrence_type === "monthly_nth_weekday" && (
              <Field label="Nième semaine du mois">
                <input value={form.nth_week_of_month} onChange={(e) => setForm({ ...form, nth_week_of_month: e.target.value })} placeholder="3" style={inputStyle} />
              </Field>
            )}
            <Field label="Heure (HH:MM)">
              <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="06:30" style={inputStyle} />
            </Field>
            <Field label="Libellé heure alternatif (ex: Nuit)">
              <input value={form.time_label} onChange={(e) => setForm({ ...form, time_label: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Note">
              <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Ordre d'affichage">
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} style={inputStyle} />
            </Field>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <label className="flex items-center gap-2" style={{ fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.counts_as_mass} onChange={(e) => setForm({ ...form, counts_as_mass: e.target.checked })} />
              Compte comme messe (pour "prochaine messe")
            </label>
            <label className="flex items-center gap-2" style={{ fontSize: "0.85rem" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Actif
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" style={{ background: "#0B3D91", color: "#fff", padding: "8px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
              Enregistrer
            </button>
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: 8, cursor: "pointer" }}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Groupe</th>
            <th style={th}>Jours</th>
            <th style={th}>Heure</th>
            <th style={th}>Type</th>
            <th style={th}>Messe ?</th>
            <th style={th}>Actif</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{r.group_label}</td>
              <td style={td}>{r.recurrence_type === "special" ? "—" : (r.weekdays || []).map((d) => WEEKDAY_LABELS[d]).join(", ")}</td>
              <td style={td}>{r.time_label || r.time}</td>
              <td style={td}>{r.type}</td>
              <td style={td}>{r.counts_as_mass ? "Oui" : "Non"}</td>
              <td style={td}>{r.is_active ? "Oui" : "Non"}</td>
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
