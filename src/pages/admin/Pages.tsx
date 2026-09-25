import { useEffect, useState } from "react";
import { apiFormData, apiGet, apiPut, mediaUrl } from "@/lib/api";
import ImageUpload from "./ImageUpload";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageKey = "genese" | "histoire" | "savio" | "organisation" | "archidiocese" | "caritas";

interface PageBlock {
  id?: number;
  kind: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  meta: string | null;
  icon: string | null;
  is_highlight: boolean;
  sort_order: number;
  is_active: boolean;
}

interface PageContent {
  id: number;
  key: PageKey;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  intro: string | null;
  extra: Record<string, any> | null;
  blocks: PageBlock[];
}

// ─── Config des 6 pages ──────────────────────────────────────────────────────

const KIND_LABELS: Record<string, string> = {
  cure: "Curé",
  timeline: "Étape / date clé",
  milestone: "Étape Youpwè",
  card: "Carte",
  bullet: "Ligne",
  stat: "Chiffre clé",
};

/** Which block kinds each page uses, and which text fields matter. */
const PAGES: { key: PageKey; label: string; kinds: string[]; extras: { key: string; label: string; type?: "area" | "pairs" }[] }[] = [
  {
    key: "genese", label: "Genèse",
    kinds: ["timeline", "cure"],
    extras: [
      { key: "section_label", label: "Libellé de section 1" },
      { key: "section_title", label: "Titre de section 1" },
      { key: "timeline_label", label: "Libellé succession pastorale" },
      { key: "timeline_title", label: "Titre succession pastorale" },
      { key: "timeline_intro", label: "Intro succession pastorale", type: "area" },
      { key: "quote", label: "Citation", type: "area" },
      { key: "quote_author", label: "Auteur de la citation" },
    ],
  },
  {
    key: "histoire", label: "Histoire",
    kinds: ["timeline", "milestone"],
    extras: [
      { key: "youpwe_label", label: "Libellé section Youpwè" },
      { key: "youpwe_title", label: "Titre section Youpwè" },
      { key: "youpwe_intro", label: "Intro Youpwè", type: "area" },
    ],
  },
  {
    key: "savio", label: "Saint Dominique Savio",
    kinds: ["bullet"],
    extras: [
      { key: "bio_label", label: "Libellé repères biographiques" },
      { key: "bio", label: "Repères biographiques (label / valeur)", type: "pairs" },
      { key: "section_label", label: "Libellé section vie" },
      { key: "section_title", label: "Titre section vie" },
      { key: "quote", label: "Citation", type: "area" },
      { key: "quote_author", label: "Auteur de la citation" },
      { key: "spirituality_label", label: "Libellé spiritualité" },
      { key: "prayer_title", label: "Titre de la prière" },
      { key: "prayer", label: "Prière", type: "area" },
    ],
  },
  {
    key: "organisation", label: "Organisation",
    kinds: ["bullet", "stat", "card"],
    extras: [
      { key: "structure_title", label: "Titre structure pastorale" },
      { key: "stats_title", label: "Titre chiffres clés" },
      { key: "chart_title", label: "Titre organigramme" },
    ],
  },
  {
    key: "archidiocese", label: "Archidiocèse",
    kinds: ["card"],
    extras: [
      { key: "facts", label: "Repères (label / valeur)", type: "pairs" },
      { key: "cameroon_title", label: "Titre Église au Cameroun" },
    ],
  },
  {
    key: "caritas", label: "Caritas",
    kinds: ["card"],
    extras: [
      { key: "section_label", label: "Libellé de section" },
      { key: "section_title", label: "Titre de section" },
      { key: "section_intro", label: "Intro de section", type: "area" },
      { key: "cta_title", label: "Titre encart don" },
      { key: "cta_text", label: "Texte encart don", type: "area" },
    ],
  },
];

// ─── Composant ───────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: "0.85rem" };
const btn: React.CSSProperties = { background: "#0B3D91", color: "#fff", padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" };
const btnGhost: React.CSSProperties = { background: "none", border: "1px solid #e5e7eb", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.8rem", marginRight: 10 };

export default function AdminPages() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [activeKey, setActiveKey] = useState<PageKey>("genese");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function load() {
    apiGet<PageContent[]>("/admin/pages").then(setPages).catch(() => {});
  }

  useEffect(load, []);

  const page = pages.find((p) => p.key === activeKey) ?? null;
  const pageConfig = PAGES.find((p) => p.key === activeKey)!;

  function updatePage(patch: Partial<PageContent>) {
    setPages((old) => old.map((p) => (p.key === activeKey ? { ...p, ...patch } : p)));
  }

  function updateExtra(key: string, value: unknown) {
    setPages((old) => old.map((p) => (p.key === activeKey ? { ...p, extra: { ...(p.extra ?? {}), [key]: value } } : p)));
  }

  function updateBlock(idx: number, patch: Partial<PageBlock>) {
    setPages((old) => old.map((p) => {
      if (p.key !== activeKey) return p;
      const blocks = (p.blocks ?? []).map((b, i) => (i === idx ? { ...b, ...patch } : b));
      return { ...p, blocks };
    }));
  }

  function addBlock(kind: string) {
    setPages((old) => old.map((p) => {
      if (p.key !== activeKey) return p;
      const blocks = [...(p.blocks ?? [])];
      blocks.push({ kind, title: "", subtitle: "", description: "", image: null, meta: "", icon: "", is_highlight: false, sort_order: blocks.length, is_active: true });
      return { ...p, blocks };
    }));
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    setPages((old) => old.map((p) => {
      if (p.key !== activeKey) return p;
      const blocks = [...(p.blocks ?? [])];
      const target = idx + dir;
      if (target < 0 || target >= blocks.length) return p;
      [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
      return { ...p, blocks };
    }));
  }

  function removeBlock(idx: number) {
    setPages((old) => old.map((p) => {
      if (p.key !== activeKey) return p;
      return { ...p, blocks: (p.blocks ?? []).filter((_, i) => i !== idx) };
    }));
  }

  async function save() {
    if (!page) return;
    setSaving(true);
    try {
      const payload = {
        title: page.title,
        subtitle: page.subtitle ?? "",
        hero_image: page.hero_image ?? "",
        intro: page.intro ?? "",
        extra: page.extra ?? {},
        blocks: (page.blocks ?? []).map((b, i) => ({ ...b, sort_order: i })),
      };
      const updated = await apiPut<PageContent>(`/admin/pages/${activeKey}`, payload);
      setPages((old) => old.map((p) => (p.key === activeKey ? updated : p)));
      setSavedAt(new Date().toLocaleTimeString("fr-FR"));
    } finally {
      setSaving(false);
    }
  }

  // ── Rendu ────────────────────────────────────────────────────────────────

  if (pages.length === 0) {
    return <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Chargement… (aucune page reçue de l'API)</p>;
  }

  const blocksOfKind = (kind: string) => (page?.blocks ?? []).filter((b) => b.kind === kind);
  const blockIndex = (b: PageBlock) => (page?.blocks ?? []).indexOf(b);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Pages de présentation</h1>
        <div className="flex items-center gap-3">
          {savedAt && <span style={{ fontSize: "0.78rem", color: "#059669" }}>Enregistré à {savedAt}</span>}
          <button onClick={save} disabled={saving} style={{ ...btn, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Enregistrement…" : "💾 Enregistrer"}
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PAGES.map((p) => (
          <button key={p.key} onClick={() => setActiveKey(p.key)}
            style={{
              ...btnGhost,
              background: activeKey === p.key ? "#0B3D91" : "#fff",
              color: activeKey === p.key ? "#fff" : "#374151",
              fontWeight: activeKey === p.key ? 700 : 400,
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {!page ? (
        <p style={{ color: "#6b7280" }}>Page « {activeKey} » introuvable. Lancez <code>php artisan db:seed --class=PageContentSeeder</code>.</p>
      ) : (
        <div className="flex flex-col gap-6" style={{ maxWidth: 860 }}>
          {/* Hero */}
          <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1c2340", marginBottom: 12 }}>En-tête de page</h2>
            <Field label="Titre"><input value={page.title} onChange={(e) => updatePage({ title: e.target.value })} style={inputStyle} /></Field>
            <Field label="Sous-titre (bandeau)"><input value={page.subtitle ?? ""} onChange={(e) => updatePage({ subtitle: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} /></Field>
            <div style={{ marginTop: 8 }}>
              <ImageUpload label="Image du bandeau" folder="pages" value={page.hero_image} onChange={(path) => updatePage({ hero_image: path })} height={110} />
            </div>
            <Field label="Texte d'introduction (paragraphes séparés par une ligne vide ; **gras** et *italique* acceptés)">
              <textarea value={page.intro ?? ""} onChange={(e) => updatePage({ intro: e.target.value })} rows={7} style={{ ...inputStyle, marginTop: 8 }} />
            </Field>
          </section>

          {/* Extras */}
          {pageConfig.extras.length > 0 && (
            <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1c2340", marginBottom: 12 }}>Titres et textes de sections</h2>
              {pageConfig.extras.map((ex) => (
                <Field key={ex.key} label={ex.label}>
                  {ex.type === "pairs" ? (
                    <PairsEditor
                      pairs={Array.isArray(page.extra?.[ex.key]) ? (page.extra[ex.key] as [string, string][]) : []}
                      onChange={(pairs) => updateExtra(ex.key, pairs)}
                    />
                  ) : ex.type === "area" ? (
                    <textarea value={String(page.extra?.[ex.key] ?? "")} onChange={(e) => updateExtra(ex.key, e.target.value)} rows={3} style={{ ...inputStyle, marginTop: 8 }} />
                  ) : (
                    <input value={String(page.extra?.[ex.key] ?? "")} onChange={(e) => updateExtra(ex.key, e.target.value)} style={{ ...inputStyle, marginTop: 8 }} />
                  )}
                </Field>
              ))}
            </section>
          )}

          {/* Blocs par type */}
          {pageConfig.kinds.map((kind) => {
            const blocks = blocksOfKind(kind);
            return (
              <section key={kind} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", color: "#1c2340" }}>
                    {KIND_LABELS[kind] ?? kind} <span style={{ color: "#9ca3af", fontSize: "0.8rem", fontFamily: "Montserrat" }}>({blocks.length})</span>
                  </h2>
                  <button onClick={() => addBlock(kind)} style={btn}>+ Ajouter</button>
                </div>

                {blocks.length === 0 && <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Aucun élément pour le moment.</p>}

                <div className="flex flex-col gap-3">
                  {blocks.map((b) => {
                    const idx = blockIndex(b);
                    return (
                      <div key={b.id ?? `new-${idx}`} style={{ border: "1px solid #f1f5f9", borderRadius: 10, padding: 14, background: "#FDFDFE" }}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0B3D91" }}>
                            {b.meta || b.title || "(nouveau)"}
                            {b.is_highlight && <span style={{ color: "#D4AF37" }}> · mis en avant</span>}
                          </span>
                          <div>
                            <button onClick={() => moveBlock(idx, -1)} style={linkBtn} title="Monter">↑</button>
                            <button onClick={() => moveBlock(idx, 1)} style={{ ...linkBtn, marginRight: 8 }} title="Descendre">↓</button>
                            <button onClick={() => removeBlock(idx)} style={{ ...linkBtn, color: "#b91c1c" }}>Supprimer</button>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <Field label={kind === "stat" ? "Valeur (ex. 1961)" : kind === "cure" || kind === "timeline" || kind === "milestone" ? "Date / années" : "Titre"}>
                            <input value={b.meta ?? ""} onChange={(e) => updateBlock(idx, { meta: e.target.value })} style={inputStyle} />
                          </Field>
                          <Field label={kind === "stat" ? "Libellé" : kind === "bullet" ? "Ligne" : "Titre"}>
                            <input value={b.title ?? ""} onChange={(e) => updateBlock(idx, { title: e.target.value })} style={inputStyle} />
                          </Field>
                        </div>
                        {(kind === "cure" || kind === "timeline" || kind === "milestone" || kind === "card") && (
                          <Field label="Description">
                            <textarea value={b.description ?? ""} onChange={(e) => updateBlock(idx, { description: e.target.value })} rows={2} style={{ ...inputStyle, marginTop: 8 }} />
                          </Field>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: kind === "card" ? 10 : 0 }}>
                          {kind === "cure" && (
                            <ImageUpload label="Photo" folder="pages" value={b.image} onChange={(path) => updateBlock(idx, { image: path })} height={90} />
                          )}
                          {kind === "card" && (
                            <Field label="Icône (emoji)">
                              <input value={b.icon ?? ""} onChange={(e) => updateBlock(idx, { icon: e.target.value })} style={inputStyle} />
                            </Field>
                          )}
                          {kind === "cure" && (
                            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "#374151", marginTop: 10 }}>
                              <input type="checkbox" checked={b.is_highlight} onChange={(e) => updateBlock(idx, { is_highlight: e.target.checked })} />
                              Curé actuel (encadré doré)
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
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

/** Editor for extra fields stored as a list of [label, value] pairs (bio repères, facts…). */
function PairsEditor({ pairs, onChange }: { pairs: [string, string][]; onChange: (pairs: [string, string][]) => void }) {
  function update(index: number, which: 0 | 1, value: string) {
    onChange(pairs.map((pair, i) => (i === index ? (which === 0 ? [value, pair[1]] : [pair[0], value]) : pair)) as [string, string][]);
  }

  function remove(index: number) {
    onChange(pairs.filter((_, i) => i !== index));
  }

  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
      {pairs.length === 0 && <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Aucune ligne.</span>}
      {pairs.map(([label, value], i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input value={label} placeholder="Libellé" onChange={(e) => update(i, 0, e.target.value)} style={inputStyle} />
          <input value={value} placeholder="Valeur" onChange={(e) => update(i, 1, e.target.value)} style={inputStyle} />
          <button type="button" onClick={() => remove(i)} style={{ ...linkBtn, color: "#b91c1c", marginRight: 0 }} title="Supprimer la ligne">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...pairs, ["", ""]])} style={{ ...btnGhost, alignSelf: "flex-start", marginTop: 4 }}>
        + Ajouter une ligne
      </button>
    </div>
  );
}
