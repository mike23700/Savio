import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, apiFormData, ApiError, mediaUrl } from "@/lib/api";
import { confirmDialog } from "./ConfirmDialog";
import { youtubeThumb, type MediaCategory, type MediaItem } from "@/lib/content-types";
import ImageUpload from "./ImageUpload";

type Tab = "photo" | "video";

const emptyForm = { media_category_id: "", title: "", image: "", youtube_url: "", taken_at: "", sort_order: 0, is_published: true };

export default function AdminMediatheque() {
  const [tab, setTab] = useState<Tab>("photo");
  const [rows, setRows] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const [catEditingId, setCatEditingId] = useState<number | "new" | null>(null);
  const [catName, setCatName] = useState("");
  const [catError, setCatError] = useState<string | null>(null);

  const bulkInput = useRef<HTMLInputElement>(null);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);

  function load() {
    apiGet<MediaItem[]>("/admin/media").then(setRows);
    apiGet<MediaCategory[]>("/media-categories").then(setCategories);
  }

  useEffect(load, []);

  function startNew() {
    setEditingId("new");
    setError(null);
    setForm({ ...emptyForm, media_category_id: filter });
  }

  function startEdit(m: MediaItem) {
    setEditingId(m.id);
    setError(null);
    setForm({
      media_category_id: m.media_category_id ? String(m.media_category_id) : "", title: m.title || "",
      image: m.image || "", youtube_url: m.youtube_url || "", taken_at: m.taken_at?.slice(0, 10) || "",
      sort_order: m.sort_order, is_published: m.is_published,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form, type: tab,
      media_category_id: form.media_category_id ? Number(form.media_category_id) : null,
      taken_at: form.taken_at || null,
    };
    try {
      if (editingId === "new") await apiPost("/admin/media", payload);
      else if (editingId) await apiPut(`/admin/media/${editingId}`, payload);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? Object.values(err.errors ?? {})[0]?.[0] || err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function remove(m: MediaItem) {
    if (!(await confirmDialog(m.type === "photo"
      ? { message: <>Supprimer la photo <strong>{m.title || "sans titre"}</strong> ?</> }
      : { title: "Retirer la vidéo", message: <>Retirer la vidéo <strong>{m.title || "sans titre"}</strong> du site ? Elle restera disponible sur YouTube.</>, confirmLabel: "Retirer" }))) return;
    await apiDelete(`/admin/media/${m.id}`);
    load();
  }

  /** Import several photos at once into the chosen category. */
  async function bulkUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    let done = 0;
    let failed = 0;
    for (const file of list) {
      setBulkProgress(`Import ${done + failed + 1} / ${list.length}…`);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "media");
        const { path } = await apiFormData<{ path: string }>("/admin/uploads/image", fd, "POST");
        await apiPost("/admin/media", {
          type: "photo", image: path, title: file.name.replace(/\.[^.]+$/, ""),
          media_category_id: bulkCategory ? Number(bulkCategory) : null, is_published: true, sort_order: 0,
        });
        done++;
      } catch {
        failed++;
      }
    }
    setBulkProgress(failed ? `${done} photo(s) importée(s), ${failed} échec(s).` : `${done} photo(s) importée(s).`);
    if (bulkInput.current) bulkInput.current.value = "";
    load();
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError(null);
    try {
      if (catEditingId === "new") await apiPost("/admin/media-categories", { name: catName, sort_order: categories.length });
      else if (catEditingId) {
        const current = categories.find((c) => c.id === catEditingId);
        await apiPut(`/admin/media-categories/${catEditingId}`, { name: catName, sort_order: current?.sort_order ?? 0 });
      }
      setCatEditingId(null);
      load();
    } catch (err) {
      setCatError(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function removeCategory(c: MediaCategory) {
    if (!(await confirmDialog({ title: "Supprimer la catégorie", message: <>Supprimer la catégorie <strong>{c.name}</strong> ? Les photos et vidéos seront conservées, sans catégorie.</> }))) return;
    await apiDelete(`/admin/media-categories/${c.id}`);
    if (filter === String(c.id)) setFilter("");
    load();
  }

  const ofTab = rows.filter((r) => r.type === tab);
  const visible = filter ? ofTab.filter((r) => String(r.media_category_id) === filter) : ofTab;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Médiathèque</h1>
        <div className="flex items-center gap-4">
          <a href={tab === "photo" ? "/paroisse/mediatheque" : "/paroisse/mediatheque?onglet=videos"} target="_blank" rel="noreferrer" style={{ ...linkBtn, marginRight: 0 }}>
            Voir sur le site ↗
          </a>
          <button onClick={startNew} style={primaryBtn}>{tab === "photo" ? "+ Ajouter une photo" : "+ Ajouter une vidéo YouTube"}</button>
        </div>
      </div>

      {/* Catégories */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1c2340" }}>Catégories (photos et vidéos)</h2>
          <button onClick={() => { setCatEditingId("new"); setCatName(""); setCatError(null); }} style={linkBtn}>+ Nouvelle catégorie</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e5e7eb", borderRadius: 999, padding: "4px 6px 4px 12px" }}>
              <span style={{ fontSize: "0.82rem" }}>{c.name}</span>
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                ({rows.filter((r) => r.media_category_id === c.id && r.type === "photo").length} 📷 · {rows.filter((r) => r.media_category_id === c.id && r.type === "video").length} ▶)
              </span>
              <button onClick={() => { setCatEditingId(c.id); setCatName(c.name); setCatError(null); }} style={{ ...linkBtn, marginRight: 0 }}>✎</button>
              <button onClick={() => removeCategory(c)} style={{ ...linkBtn, marginRight: 0, color: "#b91c1c" }}>✕</button>
            </div>
          ))}
        </div>
        {catEditingId !== null && (
          <form onSubmit={saveCategory} className="flex flex-wrap items-end gap-3 mt-4">
            <Field label="Nom"><input required value={catName} onChange={(e) => setCatName(e.target.value)} style={inputStyle} /></Field>
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setCatEditingId(null)} style={secondaryBtn}>Annuler</button>
            {catError && <span style={{ fontSize: "0.8rem", color: "#b91c1c" }}>{catError}</span>}
          </form>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-4">
        {(["photo", "video"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setEditingId(null); }}
            style={{ padding: "8px 18px", borderRadius: 999, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              background: tab === t ? "#0B3D91" : "#fff", color: tab === t ? "#fff" : "#374151", border: `1px solid ${tab === t ? "#0B3D91" : "#e5e7eb"}` }}>
            {t === "photo" ? `📷 Photos (${rows.filter((r) => r.type === "photo").length})` : `▶ Vidéos (${rows.filter((r) => r.type === "video").length})`}
          </button>
        ))}
      </div>

      {tab === "photo" && (
        <div style={{ background: "#E8F2FF", borderRadius: 12, padding: 14, marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", fontSize: "0.85rem" }}>
          <strong style={{ color: "#0B3D91" }}>Import multiple :</strong>
          <select value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="">— Catégorie —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="button" onClick={() => bulkInput.current?.click()} style={primaryBtn}>Choisir des photos…</button>
          <input ref={bulkInput} type="file" accept="image/*" multiple hidden onChange={(e) => bulkUpload(e.target.files)} />
          {bulkProgress && <span style={{ color: "#374151" }}>{bulkProgress}</span>}
        </div>
      )}

      {editingId !== null && (
        <form onSubmit={save} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 720 }}>
          {tab === "photo" ? (
            <ImageUpload label="Photo" folder="media" value={form.image} onChange={(image) => setForm({ ...form, image })} height={160} />
          ) : (
            <div>
              <Field label="Lien de la vidéo YouTube (ex: https://www.youtube.com/watch?v=… ou https://youtu.be/…)">
                <input required value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} style={inputStyle} placeholder="https://www.youtube.com/watch?v=" />
              </Field>
              {parseYoutubeId(form.youtube_url) && (
                <img src={youtubeThumb(parseYoutubeId(form.youtube_url)!)} alt="" style={{ width: 240, borderRadius: 8, marginTop: 10 }} />
              )}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Titre / légende"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} /></Field>
            </div>
            <Field label="Catégorie">
              <select value={form.media_category_id} onChange={(e) => setForm({ ...form, media_category_id: e.target.value })} style={inputStyle}>
                <option value="">— Sans catégorie —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Date (facultatif)"><input type="date" value={form.taken_at} onChange={(e) => setForm({ ...form, taken_at: e.target.value })} style={inputStyle} /></Field>
            <Field label="Ordre d'affichage"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} style={inputStyle} /></Field>
            <label className="flex items-center gap-2" style={{ fontSize: "0.85rem", alignSelf: "end", paddingBottom: 8 }}>
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Publiée sur le site
            </label>
          </div>
          {error && <p style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: 8 }}>{error}</p>}
          <div className="flex gap-3 mt-4">
            <button type="submit" style={primaryBtn}>Enregistrer</button>
            <button type="button" onClick={() => setEditingId(null)} style={secondaryBtn}>Annuler</button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Filtrer :</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{tab === "photo" ? "Aucune photo." : "Aucune vidéo."}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {visible.map((m) => (
            <div key={m.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", opacity: m.is_published ? 1 : 0.55 }}>
              <div style={{ aspectRatio: "4 / 3", background: "#F5F7FA" }}>
                {m.type === "photo"
                  ? m.image && <img src={mediaUrl(m.image) ?? undefined} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : m.youtube_id && <img src={youtubeThumb(m.youtube_id)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1c2340", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title || "Sans titre"}</div>
                <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 2 }}>
                  {m.category?.name ?? "Sans catégorie"}{!m.is_published && " · masquée"}
                </div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => startEdit(m)} style={linkBtn}>Modifier</button>
                  <button onClick={() => remove(m)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Mirror of MediaItem::youtubeId() on the backend, for the live preview. */
function parseYoutubeId(url: string): string | null {
  const u = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(u)) return u;
  const m = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
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
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 12 };
