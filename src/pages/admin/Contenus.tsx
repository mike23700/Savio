import { useEffect, useRef, useState } from "react"

import { apiFormData, apiGet, apiPut, ApiError, mediaUrl } from "@/lib/api"

import { BANNER_KEYS, DEFAULT_BANNER } from "@/lib/banner"

import { parseTracks, type MusicTrack } from "@/components/BackgroundMusic"

import { defaultSlides, parseSlides, type HomeSlide } from "@/lib/slides"

import seNourrir from "@/lib/i18n/dicts/seNourrir"

import ImageUpload from "./ImageUpload"

const NF = seNourrir.fr as Record<string, string>

type Values = Record<string, string>

/**
 * Editable texts, stored as `text.<key>` settings. Fields are pre-filled with
 * the text currently shown on the site (`def`); saving an unchanged built-in
 * text stores nothing, so the site keeps its French / English versions.
 */
const TEXT_GROUPS: {
  title: string
  fields: { key: string; label: string; area?: boolean; help?: string; def?: string }[]
}[] = [
  {
    title: "Intention de messe",
    fields: [
      {
        key: "intention_intro",
        label: "Texte affiché avant l'encadré orange « Offrande de messe »",
        area: true,
      },
    ],
  },
  {
    title: "Journal paroissial (page de présentation)",
    fields: [
      { key: "journal_titre", label: "Titre", def: NF["nourrir.journal.titre"] },
      { key: "journal_sous_titre", label: "Sous-titre (dans la bannière)", def: NF["nourrir.journal.sousTitre"] },
      { key: "journal_intro", label: "Présentation", area: true, def: NF["nourrir.journal.intro"] },
      {
        key: "journal_programme",
        label: "Au sommaire",
        area: true,
        help: "Un élément par ligne.",
        def: [1, 2, 3, 4].map((n) => NF[`nourrir.journal.programme.${n}`]).join("\n"),
      },
    ],
  },
]

export default function AdminContenus() {
  const [values, setValues] = useState<Values>({})

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)

  useEffect(() => {
    apiGet<Values>("/settings")
      .then((s) => {
        // Show the text currently displayed on the site when nothing is saved yet.
        const v = { ...s }
        for (const g of TEXT_GROUPS)
          for (const f of g.fields)
            if (f.def && !(v[`text.${f.key}`] ?? "").trim()) v[`text.${f.key}`] = f.def
        setValues(v)
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }))

  const tracks = parseTracks(values["music.tracks"])

  const setTracks = (list: MusicTrack[]) => set("music.tracks", JSON.stringify(list))

  // Home carousel: pre-filled with the slides currently shown on the site.
  const slides: HomeSlide[] = parseSlides(values["home.slides"], { keepEmpty: true }) ?? defaultSlides("fr")

  const [openSlide, setOpenSlide] = useState<number | null>(null)

  const setSlides = (list: HomeSlide[]) => set("home.slides", JSON.stringify(list))

  const setSlide = (i: number, patch: Partial<HomeSlide>) =>
    setSlides(slides.map((x, j) => (j === i ? { ...x, ...patch } : x)))

  /** Only the keys managed on this page are sent. */
  function managedKeys(): Values {
    const out: Values = {}
    for (const b of BANNER_KEYS) out[`banner.${b.key}`] = values[`banner.${b.key}`] ?? ""
    for (const g of TEXT_GROUPS)
      for (const f of g.fields) {
        const v = values[`text.${f.key}`] ?? ""
        out[`text.${f.key}`] = f.def && v.trim() === f.def.trim() ? "" : v
      }
    out["music.enabled"] = values["music.enabled"] === "1" ? "1" : "0"
    out["music.volume"] = values["music.volume"] ?? "0.35"
    out["music.tracks"] = JSON.stringify(tracks.filter((t) => t.url.trim()))
    // Only once edited: until then the site keeps its built-in (bilingual) slides.
    if ("home.slides" in values)
      out["home.slides"] = values["home.slides"]
        ? JSON.stringify(slides.filter((x) => x.img || x.title))
        : "" // reset → built-in slides
    return out
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const updated = await apiPut<Values>("/admin/settings", { settings: managedKeys() })
      setValues(updated)
      setMessage({ kind: "ok", text: "Modifications enregistrées. Elles apparaissent sur le site au prochain chargement de page." })
    } catch (e) {
      setMessage({ kind: "error", text: e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div style={{ maxWidth: 960 }}>
      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 8 }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>
          Bannières, textes & musique
        </h1>
        <button onClick={save} disabled={saving} style={primaryBtn}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
      {message && (
        <div
          style={{
            background: message.kind === "ok" ? "#dcfce7" : "#fee2e2",
            color: message.kind === "ok" ? "#166534" : "#991b1b",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: "0.85rem",
            margin: "12px 0",
          }}
        >
          {message.text}
        </div>
      )}

      {/* ── Home carousel ── */}
      <Section title="Grand carrousel de la page d'accueil">
        <p style={help}>
          Cliquez sur une diapositive pour la modifier. Elles défilent toutes les 5 secondes, dans
          l'ordre ci-dessous. Le lien du bouton peut être une page du site (/agenda, /don,
          /actualites…) ou une adresse complète (https://…).
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {slides.map((sl, i) => (
            <SlideCard
              key={i}
              index={i}
              count={slides.length}
              slide={sl}
              open={openSlide === i}
              onToggle={() => setOpenSlide(openSlide === i ? null : i)}
              onChange={(patch) => setSlide(i, patch)}
              onMove={(d) => {
                const j = i + d
                const n = [...slides]
                ;[n[i], n[j]] = [n[j], n[i]]
                setSlides(n)
                if (openSlide === i) setOpenSlide(j)
              }}
              onRemove={() => {
                setSlides(slides.filter((_, j) => j !== i))
                setOpenSlide(null)
              }}
            />
          ))}
        </div>
        <div className="flex gap-3 flex-wrap" style={{ marginTop: 12 }}>
          <button
            type="button"
            style={secondaryBtn}
            onClick={() => {
              setSlides([...slides, { img: "", tag: "", date: "", title: "", desc: "", cta: "En savoir plus", to: "/actualites" }])
              setOpenSlide(slides.length)
            }}
          >
            + Ajouter une diapositive
          </button>
          {"home.slides" in values && values["home.slides"] && (
            <button type="button" style={secondaryBtn} onClick={() => set("home.slides", "")}>
              Revenir au carrousel d'origine
            </button>
          )}
        </div>
      </Section>

      {/* ── Banners ── */}
      <Section title="Bannières des pages">
        <p style={help}>
          Image large affichée en haut de la page (format conseillé : 1530 × 320 px). Sans
          bannière propre, une page utilise la bannière par défaut.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {BANNER_KEYS.map((b) => {
            const key = `banner.${b.key}`
            return (
              <div key={b.key} style={card}>
                <ImageUpload
                  label={b.label}
                  folder="banners"
                  height={90}
                  value={values[key]}
                  onChange={(path) => set(key, path)}
                  fallbackSrc={
                    b.key === "default"
                      ? DEFAULT_BANNER
                      : (mediaUrl(values["banner.default"]) ?? DEFAULT_BANNER)
                  }
                />
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── Texts ── */}
      {TEXT_GROUPS.map((g) => (
        <Section key={g.title} title={g.title}>
          <div style={{ display: "grid", gap: 12 }}>
            {g.fields.map((f) => {
              const key = `text.${f.key}`
              return (
                <label key={f.key} style={{ display: "block" }}>
                  <span style={labelStyle}>{f.label}</span>
                  {f.area ? (
                    <textarea
                      rows={f.key.includes("pieces") || f.key.includes("programme") ? 7 : 5}
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={f.def ? "" : "Aucun texte affiché actuellement — saisissez-en un pour l'ajouter sur le site"}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  ) : (
                    <input
                      value={values[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                      style={inputStyle}
                    />
                  )}
                  {f.help && <span style={help}>{f.help}</span>}
                </label>
              )
            })}
          </div>
        </Section>
      ))}

      {/* ── Background music ── */}
      <Section title="Musique de fond du site">
        <p style={help}>
          Les morceaux s'enchaînent en boucle. Les navigateurs interdisent le son automatique :
          la musique démarre au premier clic du visiteur, qui peut la mettre en pause avec le
          bouton en bas à gauche. Importez des fichiers MP3 (ou collez un lien direct vers un
          fichier audio). Les liens Apple Music, Spotify ou Deezer ne peuvent pas être lus
          comme musique de fond : ces services protègent leurs morceaux et exigent un
          abonnement de chaque visiteur. Utilisez des morceaux libres de droits ou dont vous
          avez l'autorisation.
        </p>
        <div className="flex items-center gap-6 flex-wrap" style={{ margin: "10px 0 14px" }}>
          <label className="flex items-center gap-2" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={values["music.enabled"] === "1"}
              onChange={(e) => set("music.enabled", e.target.checked ? "1" : "0")}
            />
            Activer la musique de fond
          </label>
          <label className="flex items-center gap-2" style={{ fontSize: "0.85rem" }}>
            Volume
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={values["music.volume"] ?? "0.35"}
              onChange={(e) => set("music.volume", e.target.value)}
            />
            {Math.round(Number(values["music.volume"] ?? "0.35") * 100)} %
          </label>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {tracks.map((t, i) => (
            <div key={i} style={{ ...card, display: "grid", gridTemplateColumns: "32px 1fr 1.4fr auto", gap: 10, alignItems: "center" }}>
              <strong style={{ color: "#0B3D91" }}>{i + 1}.</strong>
              <input
                value={t.title}
                placeholder="Titre (ex. Ave Maria)"
                onChange={(e) => setTracks(tracks.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                style={inputStyle}
              />
              <div>
                <input
                  value={t.url}
                  placeholder="Fichier importé ou lien direct .mp3"
                  onChange={(e) => setTracks(tracks.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  style={inputStyle}
                />
                {t.url && (
                  <audio controls preload="none" src={mediaUrl(t.url) ?? t.url} style={{ width: "100%", height: 32, marginTop: 6 }} />
                )}
              </div>
              <div className="flex gap-1">
                <button type="button" style={smallBtn} title="Monter" disabled={i === 0}
                  onClick={() => { const n = [...tracks]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setTracks(n) }}>↑</button>
                <button type="button" style={smallBtn} title="Descendre" disabled={i === tracks.length - 1}
                  onClick={() => { const n = [...tracks]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; setTracks(n) }}>↓</button>
                <button type="button" style={{ ...smallBtn, color: "#b91c1c" }} title="Retirer"
                  onClick={() => setTracks(tracks.filter((_, j) => j !== i))}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap" style={{ marginTop: 12 }}>
          <AudioUploadButton onUploaded={(path, name) => setTracks([...tracks, { title: name, url: path }])} />
          <button type="button" style={secondaryBtn} onClick={() => setTracks([...tracks, { title: "", url: "" }])}>
            + Ajouter un lien audio
          </button>
        </div>
      </Section>

      <div style={{ marginTop: 20 }}>
        <button onClick={save} disabled={saving} style={primaryBtn}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  )
}

/** Uploads one or several audio files to /admin/uploads/file (folder "musique"). */
function AudioUploadButton({ onUploaded }: { onUploaded: (path: string, name: string) => void }) {
  const input = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<string | null>(null)

  async function upload(files: FileList | null) {
    if (!files?.length) return
    const list = Array.from(files)
    let failed = 0
    for (const [i, file] of list.entries()) {
      setStatus(`Import ${i + 1} / ${list.length}…`)
      try {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("folder", "musique")
        const res = await apiFormData<{ path: string }>("/admin/uploads/file", fd, "POST")
        onUploaded(res.path, file.name.replace(/\.[^.]+$/, ""))
      } catch (e) {
        failed++
        setStatus(e instanceof ApiError ? e.errors?.file?.[0] || e.message : "Échec de l'import.")
      }
    }
    if (!failed) setStatus("Importé. Pensez à enregistrer.")
    if (input.current) input.current.value = ""
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" style={primaryBtn} onClick={() => input.current?.click()}>
        + Importer des fichiers MP3
      </button>
      <input ref={input} type="file" accept="audio/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      {status && <span style={{ fontSize: "0.8rem", color: "#374151" }}>{status}</span>}
    </span>
  )
}

/** One carousel slide: collapsed = thumbnail + title; open = image + fields. */
function SlideCard({
  index,
  count,
  slide,
  open,
  onToggle,
  onChange,
  onMove,
  onRemove,
}: {
  index: number
  count: number
  slide: HomeSlide
  open: boolean
  onToggle: () => void
  onChange: (patch: Partial<HomeSlide>) => void
  onMove: (d: -1 | 1) => void
  onRemove: () => void
}) {
  const thumb = mediaUrl(slide.img)

  return (
    <div style={{ border: `1px solid ${open ? "#0B3D91" : "#e5e7eb"}`, borderRadius: 12, background: "#fff", overflow: "hidden" }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, cursor: "pointer", background: open ? "#F5F8FD" : "#fff" }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#0B3D91",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        <div
          style={{
            width: 112,
            height: 49,
            borderRadius: 6,
            overflow: "hidden",
            background: "#e5e7eb",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            color: "#6b7280",
          }}
        >
          {thumb ? <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "Sans image"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#B8932B", letterSpacing: "0.08em" }}>
            {slide.tag || "—"} {slide.date && <span style={{ color: "#9ca3af", fontWeight: 500 }}>· {slide.date}</span>}
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1c2340", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {slide.title || "Nouvelle diapositive"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
          <button type="button" style={smallBtn} title="Monter" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
          <button type="button" style={smallBtn} title="Descendre" disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
          <button type="button" style={{ ...smallBtn, color: "#b91c1c" }} title="Supprimer" disabled={count <= 1} onClick={onRemove}>Supprimer</button>
        </div>
        <span style={{ color: "#6b7280", fontSize: "0.85rem", width: 16, textAlign: "center" }}>{open ? "▾" : "▸"}</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 340px) 1fr", gap: 18, padding: 16, borderTop: "1px solid #e5e7eb" }}>
          <WideImagePicker value={slide.img} onChange={(img) => onChange({ img })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignContent: "start" }}>
            <label>
              <span style={labelStyle}>Étiquette</span>
              <input value={slide.tag} placeholder="FAMILLE" onChange={(e) => onChange({ tag: e.target.value })} style={inputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Date <span style={{ fontWeight: 400, color: "#9ca3af" }}>(facultatif)</span></span>
              <input value={slide.date} placeholder="5 octobre 2026" onChange={(e) => onChange({ date: e.target.value })} style={inputStyle} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              <span style={labelStyle}>Titre</span>
              <input value={slide.title} onChange={(e) => onChange({ title: e.target.value })} style={{ ...inputStyle, fontWeight: 600 }} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              <span style={labelStyle}>Texte</span>
              <textarea rows={3} value={slide.desc} onChange={(e) => onChange({ desc: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
            </label>
            <label>
              <span style={labelStyle}>Texte du bouton</span>
              <input value={slide.cta} placeholder="En savoir plus" onChange={(e) => onChange({ cta: e.target.value })} style={inputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Lien du bouton</span>
              <input value={slide.to} placeholder="/agenda ou https://…" onChange={(e) => onChange({ to: e.target.value })} style={inputStyle} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

/** Wide (16:7) image slot for a slide: click to upload, buttons to change / remove. */
function WideImagePicker({ value, onChange }: { value: string; onChange: (path: string) => void }) {
  const input = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const src = mediaUrl(value)

  async function upload(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "banners")
      const res = await apiFormData<{ path: string }>("/admin/uploads/image", fd, "POST")
      onChange(res.path)
    } catch (e) {
      setError(e instanceof ApiError ? e.errors?.file?.[0] || e.message : "Échec de l'import.")
    } finally {
      setUploading(false)
      if (input.current) input.current.value = ""
    }
  }

  return (
    <div>
      <span style={labelStyle}>Image</span>
      <button
        type="button"
        onClick={() => input.current?.click()}
        title={src ? "Changer l'image" : "Importer une image"}
        style={{
          width: "100%",
          aspectRatio: "16 / 7",
          borderRadius: 10,
          overflow: "hidden",
          border: src ? "1px solid #e5e7eb" : "2px dashed #c7d2e0",
          background: "#f5f7fa",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: "0.8rem",
          fontWeight: 600,
        }}
      >
        {uploading ? "Import…" : src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "+ Importer une image"}
      </button>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
        <button type="button" onClick={() => input.current?.click()} style={{ ...linkBtn, marginTop: 0 }}>
          {src ? "Changer l'image" : "Choisir un fichier"}
        </button>
        {src && (
          <button type="button" onClick={() => onChange("")} style={{ ...linkBtn, marginTop: 0, color: "#b91c1c" }}>
            Retirer
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#9ca3af" }}>1600 × 700 px · 5 Mo max</span>
      </div>
      {error && <div style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: 4 }}>{error}</div>}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files?.[0])} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginTop: 20 }}>
      <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", color: "#1c2340", marginBottom: 10 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

const card: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fafafa" }

const help: React.CSSProperties = { display: "block", fontSize: "0.76rem", color: "#6b7280", lineHeight: 1.5, marginBottom: 6 }

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", color: "#374151", fontWeight: 600, marginBottom: 4 }

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "inherit" }

const primaryBtn: React.CSSProperties = { background: "#0B3D91", color: "#fff", padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }

const secondaryBtn: React.CSSProperties = { background: "#fff", color: "#0B3D91", padding: "10px 18px", borderRadius: 8, border: "1px solid #0B3D91", fontWeight: 700, cursor: "pointer" }

const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", fontSize: "0.76rem", cursor: "pointer", padding: 0, marginTop: 6 }

const smallBtn: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 9px", fontSize: "0.8rem", cursor: "pointer" }
