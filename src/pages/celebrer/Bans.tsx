import { useState } from "react"

import { useBanner, useSiteText } from "@/lib/banner"

import { Link } from "react-router"

import { apiPost, ApiError, mediaUrl } from "@/lib/api"

import { useSettings } from "@/lib/settings"

import Icon from "@/components/Icon"

import {
  Field,
  FormMessage,
  FormStep,
  FormTitle,
  SubmitButton,
  inputClass,
  inputStyle,
} from "@/components/FormSteps"

import { useLang } from "@/lib/i18n"

const emptyForm = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  fiance1Nom: "",
  fiance1Prenom: "",
  fiance1Age: "",
  fiance2Nom: "",
  fiance2Prenom: "",
  fiance2Age: "",
}

export default function Bans() {
  const banner = useBanner("bans")

  const settings = useSettings()

  const { t } = useLang()

  const [form, setForm] = useState(emptyForm)

  const [submitted, setSubmitted] = useState(false)

  const [sending, setSending] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Texts editable in admin → Bannières & textes (fall back to the built-in ones).
  const titre = useSiteText("bans_titre", t("celebrer.bans.titre"))

  const intro = useSiteText("bans_intro", t("celebrer.bans.definitionTexte"))

  const piecesTitre = useSiteText("bans_pieces_titre", t("extra.bans.piecesTitre"))

  const piecesText = useSiteText("bans_pieces")

  const illustration = mediaUrl(settings["image.bans"])

  const docs = piecesText
    ? piecesText.split("\n").map((l) => l.trim()).filter(Boolean)
    : [1, 2, 3, 4, 5, 6, 7, 8].map((n) => t(`celebrer.bans.doc${n}`))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      await apiPost("/bans", {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        fiance1_nom: form.fiance1Nom,
        fiance1_prenom: form.fiance1Prenom,
        fiance1_age: form.fiance1Age ? Number(form.fiance1Age) : null,
        fiance2_nom: form.fiance2Nom,
        fiance2_prenom: form.fiance2Prenom,
        fiance2_age: form.fiance2Age ? Number(form.fiance2Age) : null,
      })
      setForm(emptyForm)
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? Object.values(err.errors ?? {})[0]?.[0] || err.message
          : t("celebrer.form.erreurGenerique"),
      )
    } finally {
      setSending(false)
    }
  }

  const couple: { n: 1 | 2; label: string }[] = [
    { n: 1, label: t("extra.form.fiance") },
    { n: 2, label: t("extra.form.fiancee") },
  ]

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src={banner}
          alt={t("celebrer.bans.titre")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("nav.accueil")}
            </Link>
            <Icon
              name="chevronRight"
              size={13}
              strokeWidth={1.75}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <Link
              to="/celebrer"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("celebrer.hub.titre")}
            </Link>
            <Icon
              name="chevronRight"
              size={13}
              strokeWidth={1.75}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "#D4AF37",
              }}
            >
              {t("celebrer.bans.titre")}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              color: "white",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
            }}
          >
            {t("celebrer.bans.titre")}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("celebrer.bans.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {illustration && (
            <img
              src={illustration}
              alt={titre}
              className="w-full max-h-[420px] object-contain"
              style={{ borderBottom: "4px solid #0B8BD9" }}
            />
          )}

          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.45rem",
              fontWeight: 500,
              color: "#1f2937",
              marginTop: illustration ? 24 : 0,
              marginBottom: 8,
            }}
          >
            {titre}
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.92rem",
              color: "#4b5563",
              lineHeight: 1.7,
              textAlign: "justify",
              whiteSpace: "pre-line",
            }}
          >
            {intro}
          </p>

          <hr className="my-8 border-0 border-t border-dashed border-gray-300" />

          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.45rem",
              fontWeight: 500,
              color: "#1f2937",
              marginBottom: 12,
            }}
          >
            {piecesTitre}
          </h2>
          <ul className="space-y-1.5">
            {docs.map((doc, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563" }}
              >
                <span style={{ color: "#0B8BD9", marginTop: 2, flexShrink: 0, display: "flex" }}>
                  <Icon name="check" size={16} strokeWidth={2} />
                </span>
                {doc}
              </li>
            ))}
          </ul>

          <hr className="my-8 border-0 border-t border-dashed border-gray-300" />

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">
                <Icon name="ring" size={48} />
              </div>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1c2340",
                }}
              >
                {t("celebrer.bans.envoyeeTitre")}
              </h3>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.88rem",
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
                {t("celebrer.bans.envoyeeTexte")}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  background: "#0B3D91",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.83rem",
                }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity"
              >
                {t("celebrer.bans.nouvelleDemande")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormTitle>{t("extra.form.titre")}</FormTitle>
              {error && <FormMessage kind="error">{error}</FormMessage>}
              <div className="mt-4">
                <FormStep
                  icon="user"
                  title={t("extra.form.infosPerso")}
                  desc={t("extra.form.infosPersoDesc")}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <Field label={t("extra.form.nom")}>
                      <input
                        required
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.prenom")}>
                      <input
                        required
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.email")}>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.telephone")}>
                      <input
                        required
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                  </div>
                </FormStep>

                <FormStep
                  icon="info"
                  title={t("extra.form.personnes")}
                  desc={t("extra.form.personnesDesc")}
                >
                  <div className="space-y-5">
                    {couple.map(({ n, label }) => {
                      const nomKey = `fiance${n}Nom` as const
                      const prenomKey = `fiance${n}Prenom` as const
                      const ageKey = `fiance${n}Age` as const
                      return (
                        <div
                          key={n}
                          className="grid gap-x-8 gap-y-3"
                          style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 108px" }}
                          aria-label={label}
                        >
                          <Field label={t("extra.form.nom")}>
                            <input
                              required
                              value={form[nomKey]}
                              placeholder={label}
                              onChange={(e) => setForm({ ...form, [nomKey]: e.target.value })}
                              className={inputClass}
                              style={inputStyle}
                            />
                          </Field>
                          <Field label={t("extra.form.prenom")}>
                            <input
                              required
                              value={form[prenomKey]}
                              onChange={(e) => setForm({ ...form, [prenomKey]: e.target.value })}
                              className={inputClass}
                              style={inputStyle}
                            />
                          </Field>
                          <Field label={t("extra.form.age")}>
                            <input
                              type="number"
                              min={14}
                              max={120}
                              value={form[ageKey]}
                              onChange={(e) => setForm({ ...form, [ageKey]: e.target.value })}
                              className={inputClass}
                              style={inputStyle}
                            />
                          </Field>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6">
                    <SubmitButton disabled={sending}>
                      {sending ? t("extra.form.envoi") : t("extra.form.envoyer")}
                    </SubmitButton>
                  </div>
                </FormStep>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
