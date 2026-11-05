import { useEffect, useState } from "react"

import { apiGet, apiPut, ApiError } from "@/lib/api"

import celebrer from "@/lib/i18n/dicts/celebrer"

import extras from "@/lib/i18n/dicts/extras"

import ImageUpload from "./ImageUpload"

/**
 * Texts of the public page /celebrer/bans, edited from /admin/bans and stored
 * as settings (`text.bans_*`, `image.bans`). Fields are pre-filled with the
 * text currently shown on the site, so the admin edits it in place.
 */
const FR = celebrer.fr

const DEFAULTS = {
  "text.bans_titre": FR["celebrer.bans.titre"],
  "text.bans_intro": FR["celebrer.bans.definitionTexte"],
  "text.bans_pieces_titre": extras.fr["extra.bans.piecesTitre"],
  "text.bans_pieces": [1, 2, 3, 4, 5, 6, 7, 8].map((n) => FR[`celebrer.bans.doc${n}`]).join("\n"),
}

type Key = keyof typeof DEFAULTS | "image.bans"

export default function BansTextes() {
  const [open, setOpen] = useState(false)

  const [values, setValues] = useState<Record<Key, string> | null>(null)

  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    apiGet<Record<string, string>>("/settings").then((s) => {
      const v = { "image.bans": s["image.bans"] ?? "" } as Record<Key, string>
      for (const k of Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]) {
        v[k] = s[k] && s[k].trim() ? s[k] : DEFAULTS[k]
      }
      setValues(v)
    })
  }, [])

  async function save() {
    if (!values) return
    setSaving(true)
    setMessage(null)
    try {
      await apiPut("/admin/settings", { settings: values })
      setMessage({ ok: true, text: "Textes enregistrés. Ils apparaissent sur la page Publication des bans." })
    } catch (e) {
      setMessage({ ok: false, text: e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement." })
    } finally {
      setSaving(false)
    }
  }

  const set = (k: Key, v: string) => values && setValues({ ...values, [k]: v })

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 20 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
          color: "#0B3D91",
          fontSize: "0.92rem",
        }}
      >
        {open ? "▾" : "▸"} Textes de la page publique (présentation, pièces à fournir, illustration)
      </button>
      {open && values && (
        <div style={{ padding: "0 18px 18px", display: "grid", gap: 12 }}>
          <div style={{ maxWidth: 340 }}>
            <ImageUpload
              label="Illustration au-dessus du texte (ex. alliances) — facultatif"
              folder="pages"
              height={120}
              value={values["image.bans"]}
              onChange={(p) => set("image.bans", p)}
            />
            {values["image.bans"] && (
              <button type="button" onClick={() => set("image.bans", "")} style={linkBtn}>
                Retirer l'illustration
              </button>
            )}
          </div>
          <label>
            <span style={label}>Titre</span>
            <input value={values["text.bans_titre"]} onChange={(e) => set("text.bans_titre", e.target.value)} style={input} />
          </label>
          <label>
            <span style={label}>Texte de présentation</span>
            <textarea rows={5} value={values["text.bans_intro"]} onChange={(e) => set("text.bans_intro", e.target.value)} style={input} />
          </label>
          <label>
            <span style={label}>Titre de la liste</span>
            <input value={values["text.bans_pieces_titre"]} onChange={(e) => set("text.bans_pieces_titre", e.target.value)} style={input} />
          </label>
          <label>
            <span style={label}>Pièces à fournir (une par ligne)</span>
            <textarea rows={9} value={values["text.bans_pieces"]} onChange={(e) => set("text.bans_pieces", e.target.value)} style={input} />
          </label>
          {message && (
            <div
              style={{
                background: message.ok ? "#dcfce7" : "#fee2e2",
                color: message.ok ? "#166534" : "#991b1b",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: "0.83rem",
              }}
            >
              {message.text}
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              style={{ background: "#0B3D91", color: "#fff", padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
            >
              {saving ? "Enregistrement..." : "Enregistrer les textes"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const label: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: 4 }

const input: React.CSSProperties = { width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical" }

const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", fontSize: "0.76rem", cursor: "pointer", padding: 0, marginTop: 6 }
