import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, ApiError, localDateISO } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import { formatFcfa, formatShortDate, TRANSACTION_SOURCE, TRANSACTION_TYPE, type Transaction, type TransactionCategory, type TransactionTotaux, type TransactionType } from "@/lib/content-types";
import Icon from "@/components/Icon";

const emptyForm = { type: "entree" as TransactionType, libelle: "", montant: "", date: localDateISO(), transaction_category_id: "", reference: "", notes: "" };
const emptyCat = { name: "", type: "entree" as TransactionType, color: "#0B3D91" };

const PERIODS = [
  { value: "", label: "Toutes les dates" },
  { value: "mois", label: "Ce mois-ci" },
  { value: "annee", label: "Cette année" },
];

export default function AdminComptabilite() {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [totaux, setTotaux] = useState<TransactionTotaux>({ entrees: 0, sorties: 0, solde: 0 });
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const [filterType, setFilterType] = useState<"" | TransactionType>("");
  const [filterCat, setFilterCat] = useState("");
  const [period, setPeriod] = useState("");
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [q, setQ] = useState("");

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const [catEditingId, setCatEditingId] = useState<number | "new" | null>(null);
  const [catForm, setCatForm] = useState(emptyCat);
  const [catError, setCatError] = useState<string | null>(null);

  /** Resolve the period shortcut into the explicit [du, au] range sent to the API. */
  function periodRange(): { du: string; au: string } {
    if (period === "mois") {
      const d = new Date();
      return { du: localDateISO(new Date(d.getFullYear(), d.getMonth(), 1)), au: localDateISO(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
    }
    if (period === "annee") {
      const d = new Date();
      return { du: localDateISO(new Date(d.getFullYear(), 0, 1)), au: localDateISO(new Date(d.getFullYear(), 11, 31)) };
    }
    return { du, au };
  }

  function load() {
    const { du: from, au: to } = periodRange();
    const params = new URLSearchParams();
    if (filterType) params.set("type", filterType);
    if (filterCat) params.set("transaction_category_id", filterCat);
    if (from) params.set("du", from);
    if (to) params.set("au", to);
    if (q.trim()) params.set("q", q.trim());

    apiGet<{ transactions: Transaction[]; totaux: TransactionTotaux }>(`/admin/transactions?${params}`).then((res) => {
      setRows(res.transactions);
      setTotaux(res.totaux);
    });
    apiGet<TransactionCategory[]>("/admin/transaction-categories").then(setCategories);
  }

  useEffect(load, [filterType, filterCat, period, du, au]);

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setError(null);
    setForm({
      type: t.type, libelle: t.libelle, montant: String(t.montant), date: t.date.slice(0, 10),
      transaction_category_id: t.transaction_category_id ? String(t.transaction_category_id) : "",
      reference: t.reference || "", notes: t.notes || "",
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      montant: Number(form.montant),
      transaction_category_id: form.transaction_category_id ? Number(form.transaction_category_id) : null,
    };
    try {
      if (editingId === "new") await apiPost("/admin/transactions", payload);
      else if (editingId) await apiPut(`/admin/transactions/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? firstFieldError(err) : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(t: Transaction) {
    if (!(await confirmDialog({ title: "Supprimer le mouvement", message: <>Supprimer <strong>{t.libelle}</strong> ({formatFcfa(t.montant)}) ?</> }))) return;
    await apiDelete(`/admin/transactions/${t.id}`);
    load();
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError(null);
    try {
      if (catEditingId === "new") await apiPost("/admin/transaction-categories", { ...catForm, sort_order: categories.length });
      else if (catEditingId) await apiPut(`/admin/transaction-categories/${catEditingId}`, catForm);
      setCatEditingId(null);
      load();
    } catch (err) {
      setCatError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function removeCategory(c: TransactionCategory) {
    if (!(await confirmDialog({ title: "Supprimer la catégorie", message: <>Supprimer la catégorie <strong>{c.name}</strong> ? Les mouvements seront conservés, sans catégorie.</> }))) return;
    await apiDelete(`/admin/transaction-categories/${c.id}`);
    if (filterCat === String(c.id)) setFilterCat("");
    load();
  }

  const catEntrees = categories.filter((c) => c.type === "entree");
  const catSorties = categories.filter((c) => c.type === "sortie");
  const formCategories = form.type === "entree" ? catEntrees : catSorties;

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Comptabilité</h1>
          <button onClick={() => { setEditingId("new"); setForm({ ...emptyForm, date: localDateISO() }); setError(null); }} style={primaryBtn}>
            + Ajouter un mouvement
          </button>
        </div>

        <p style={{ color: "#6b7280", fontSize: "0.82rem", maxWidth: 780, lineHeight: 1.6, marginBottom: 20 }}>
          Les dons, commandes boutique et réservations <strong>validés comme payés</strong> arrivent ici automatiquement, en entrée et dans la
          catégorie correspondant à leur source. Une réservation sur devis (sans prix) n'entre pas en comptabilité. Utilisez « + Ajouter un
          mouvement » pour les autres recettes et toutes les dépenses.
        </p>


      {/* Totaux de la sélection courante */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total des entrées", value: totaux.entrees, color: TRANSACTION_TYPE.entree.color },
          { label: "Total des sorties", value: totaux.sorties, color: TRANSACTION_TYPE.sortie.color },
          { label: "Solde", value: totaux.solde, color: totaux.solde < 0 ? TRANSACTION_TYPE.sortie.color : "#1c2340" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", borderLeft: `4px solid ${card.color}` }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>{card.label}</div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: card.color, marginTop: 6 }}>
              {formatFcfa(card.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Catégories */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1c2340" }}>Catégories</h2>
          <button onClick={() => { setCatEditingId("new"); setCatForm(emptyCat); setCatError(null); }} style={linkBtn}>+ Nouvelle catégorie</button>
        </div>
        {categories.length === 0 && <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Aucune catégorie : les mouvements seront enregistrés sans catégorie.</p>}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e5e7eb", borderRadius: 999, padding: "4px 6px 4px 10px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.82rem" }}>{c.name}</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: TRANSACTION_TYPE[c.type].color }}>{TRANSACTION_TYPE[c.type].short}</span>
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>({c.transactions_count ?? 0})</span>
              <button onClick={() => { setCatEditingId(c.id); setCatForm({ name: c.name, type: c.type, color: c.color }); setCatError(null); }} style={{ ...linkBtn, marginRight: 0 }}><Icon name="edit" size={14} strokeWidth={1.75} /></button>
              <button onClick={() => removeCategory(c)} style={{ ...linkBtn, marginRight: 0, color: "#b91c1c" }}><Icon name="close" size={14} strokeWidth={1.75} /></button>
            </div>
          ))}
        </div>
        {catEditingId !== null && (
          <form onSubmit={saveCategory} className="flex flex-wrap items-end gap-3 mt-4">
            <Field label="Nom"><input required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} style={inputStyle} /></Field>
            <Field label="Type">
              <select value={catForm.type} onChange={(e) => setCatForm({ ...catForm, type: e.target.value as TransactionType })} style={inputStyle}>
                <option value="entree">Entrée (recette)</option>
                <option value="sortie">Sortie (dépense)</option>
              </select>
            </Field>
            <Field label="Couleur"><input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} style={{ width: 48, height: 36, border: "1px solid #e5e7eb", borderRadius: 6 }} /></Field>
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setCatEditingId(null)} style={secondaryBtn}>Annuler</button>
            {catError && <span style={{ fontSize: "0.8rem", color: "#b91c1c" }}>{catError}</span>}
          </form>
        )}
      </div>

      {/* Formulaire de mouvement */}
      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 760 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Type de mouvement">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType, transaction_category_id: "" })} style={inputStyle}>
                <option value="entree">Entrée (recette)</option>
                <option value="sortie">Sortie (dépense)</option>
              </select>
            </Field>
            <Field label="Montant (FCFA)">
              <input required type="number" min="1" step="1" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} style={inputStyle} />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Libellé"><input required value={form.libelle} onChange={(e) => setForm({ ...form, libelle: e.target.value })} style={inputStyle} /></Field>
            </div>
            <Field label="Date"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} /></Field>
            <Field label="Catégorie">
              <select value={form.transaction_category_id} onChange={(e) => setForm({ ...form, transaction_category_id: e.target.value })} style={inputStyle}>
                <option value="">— Sans catégorie —</option>
                {formCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Référence / pièce justificative (facultatif)">
              <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} style={inputStyle} />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes (facultatif)"><textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={inputStyle} /></Field>
            </div>
          </div>
          {error && <p style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: 8 }}>{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>Annuler</button>
          </div>
        </form>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap items-end gap-3 mb-3">
        <div className="flex gap-2">
          {([
            { value: "", label: "Tous" },
            { value: "entree", label: "Entrées" },
            { value: "sortie", label: "Sorties" },
          ] as const).map((f) => (
            <button key={f.value} onClick={() => setFilterType(f.value)}
              style={{
                background: filterType === f.value ? "#0B3D91" : "#fff",
                color: filterType === f.value ? "#fff" : "#374151",
                border: "1px solid #e5e7eb", borderRadius: 999, padding: "6px 14px",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <Field label="Catégorie">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="">Toutes les catégories</option>
            <optgroup label="Entrées">
              {catEntrees.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </optgroup>
            <optgroup label="Sorties">
              {catSorties.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </optgroup>
          </select>
        </Field>
        <Field label="Période">
          <select value={period} onChange={(e) => { setPeriod(e.target.value); if (e.target.value) { setDu(""); setAu(""); } }} style={{ ...inputStyle, width: "auto" }}>
            {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        {period === "" && (
          <>
            <Field label="Du"><input type="date" value={du} onChange={(e) => setDu(e.target.value)} style={{ ...inputStyle, width: "auto" }} /></Field>
            <Field label="Au"><input type="date" value={au} onChange={(e) => setAu(e.target.value)} style={{ ...inputStyle, width: "auto" }} /></Field>
          </>
        )}
        <Field label="Recherche">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Libellé, référence, note…"
            style={{ ...inputStyle, width: "auto" }} />
        </Field>
        <button onClick={load} style={{ ...secondaryBtn, padding: "8px 16px" }}>Appliquer</button>
        {(filterType || filterCat || period || du || au || q) && (
          <button onClick={() => { setFilterType(""); setFilterCat(""); setPeriod(""); setDu(""); setAu(""); setQ(""); }}
            style={{ ...linkBtn, marginRight: 0 }}>Réinitialiser</button>
        )}
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Date</th><th style={th}>Libellé</th><th style={th}>Catégorie</th><th style={th}>Type</th><th style={{ ...th, textAlign: "right" }}>Montant</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={6} style={{ ...td, color: "#9ca3af", fontSize: "0.85rem" }}>Aucun mouvement pour ces filtres.</td></tr>
          )}
          {rows.map((t) => {
            const type = TRANSACTION_TYPE[t.type];
            return (
              <tr key={t.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
                <td style={{ ...td, whiteSpace: "nowrap" }}>{formatShortDate(t.date)}</td>
                <td style={td}>
                  <strong>{t.libelle}</strong>
                  {t.reference && <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>Réf. {t.reference}</span></>}
                  {t.notes && <><br /><span style={{ color: "#6b7280", fontSize: "0.75rem" }}>{t.notes}</span></>}
                  {t.source_type && (
                    <>
                      <br />
                      <span style={{ display: "inline-block", marginTop: 4, background: "#E8F2FF", color: "#0B3D91", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                        {TRANSACTION_SOURCE[t.source_type] ?? t.source_type} · automatique
                      </span>
                    </>
                  )}
                </td>
                <td style={td}>
                  {t.category ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: t.category.color }} />
                      {t.category.name}
                    </span>
                  ) : <span style={{ color: "#9ca3af" }}>—</span>}
                </td>
                <td style={td}>
                  <span style={{ color: type.color, fontWeight: 700, fontSize: "0.78rem" }}>{type.short}</span>
                </td>
                <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap", fontWeight: 700, color: type.color }}>
                  {type.sign} {formatFcfa(t.montant)}
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <button onClick={() => startEdit(t)} style={linkBtn}>Modifier</button>
                  <button onClick={() => remove(t)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
                </td>
              </tr>
            );
          })}
          {rows.length > 0 && (
            <tr style={{ borderTop: "2px solid #e5e7eb", background: "#F8FAFC", fontSize: "0.85rem" }}>
              <td style={{ ...td, fontWeight: 700, color: "#1c2340" }} colSpan={4}>Solde de la sélection</td>
              <td style={{ ...td, textAlign: "right", fontWeight: 700, color: totaux.solde < 0 ? TRANSACTION_TYPE.sortie.color : "#16a34a" }}>{formatFcfa(totaux.solde)}</td>
              <td style={td} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Show the first field-level message Laravel returned, whatever the field. */
function firstFieldError(err: ApiError): string {
  const first = Object.values(err.errors ?? {}).find((list) => list?.length);
  return first?.[0] ?? err.message;
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
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "top" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12, padding: 0 };
