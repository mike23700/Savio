import { useEffect, useState } from "react"

import { useBanner, useSiteText } from "@/lib/banner"

import { Link } from "react-router"

import { apiGet, apiPost, ApiError, localDateISO } from "@/lib/api"

import Icon from "@/components/Icon"

import {
  Field,
  FormMessage,
  FormStep,
  FormTitle,
  PlusMinus,
  SubmitButton,
  inputClass,
  inputStyle,
} from "@/components/FormSteps"

import { useLang } from "@/lib/i18n"

interface DayMass {
  time: string
  type: string
  note: string | null
}

/** One requested mass: its intention, the day and the mass chosen that day. */
interface MassRequest {
  description: string
  date: string
  heure: string
}

const emptyMass: MassRequest = { description: "", date: "", heure: "" }

const emptyPerson = { nom: "", prenom: "", email: "", telephone: "" }

export default function Intention() {
  const banner = useBanner("intention")

  const { t } = useLang()

  // Editable text shown above the offering box (admin → Bannières & textes).
  const intro = useSiteText("intention_intro")

  const [person, setPerson] = useState(emptyPerson)

  const [requests, setRequests] = useState<MassRequest[]>([{ ...emptyMass }])

  /** Masses celebrated on each selected date, keyed by YYYY-MM-DD. */
  const [massesByDate, setMassesByDate] = useState<Record<string, DayMass[]>>({})

  const [submitted, setSubmitted] = useState(false)

  const [sending, setSending] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Load the masses of every newly selected date.
  const dates = [...new Set(requests.map((r) => r.date).filter(Boolean))]

  useEffect(() => {
    for (const d of dates) {
      if (massesByDate[d]) continue
      apiGet<DayMass[]>(`/mass-schedule/day?date=${d}`)
        .then((list) => setMassesByDate((m) => ({ ...m, [d]: list })))
        .catch(() => setMassesByDate((m) => ({ ...m, [d]: [] })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates.join(",")])

  // Pre-select the only mass of a day, drop a time that does not exist that day.
  useEffect(() => {
    setRequests((rs) => {
      let changed = false
      const next = rs.map((r) => {
        const list = r.date ? massesByDate[r.date] : undefined
        if (!list) return r
        const heure = list.some((m) => m.time === r.heure)
          ? r.heure
          : list.length === 1
            ? list[0].time
            : ""
        if (heure !== r.heure) changed = true
        return heure === r.heure ? r : { ...r, heure }
      })
      return changed ? next : rs
    })
  }, [massesByDate])

  const setRequest = (i: number, patch: Partial<MassRequest>) =>
    setRequests((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    for (const r of requests) {
      const list = r.date ? massesByDate[r.date] : undefined
      if (r.date && list && list.length > 0 && !r.heure) {
        setError(t("celebrer.intention.erreurMesse"))
        return
      }
    }

    setSending(true)
    try {
      // One intention per requested mass.
      for (const r of requests) {
        await apiPost("/intentions", {
          nom: person.nom,
          prenom: person.prenom,
          email: person.email || null,
          telephone: person.telephone,
          description: r.description,
          date_souhaitee: r.date || null,
          heure_souhaitee: r.date ? r.heure || null : null,
        })
      }
      setPerson(emptyPerson)
      setRequests([{ ...emptyMass }])
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

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src={banner}
          alt={t("celebrer.intention.titre")}
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
              {t("celebrer.intention.titre")}
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
            {t("celebrer.intention.titre")}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("celebrer.intention.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {intro && (
            <div
              className="mb-8"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.92rem",
                color: "#374151",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                textAlign: "justify",
              }}
            >
              {intro}
            </div>
          )}

          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-8 flex gap-4 items-start">
            <span style={{ flexShrink: 0, display: "flex" }}>
              <Icon name="pray" size={28} />
            </span>
            <div>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1c2340",
                  marginBottom: 4,
                }}
              >
                {t("celebrer.intention.offrandeTitre")}
              </h3>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.85rem",
                  color: "#92400e",
                  lineHeight: 1.7,
                }}
              >
                {t("celebrer.intention.offrandeAvant")}{" "}
                <strong>3 000 FCFA</strong>.{" "}
                {t("celebrer.intention.offrandeApres")}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">
                <Icon name="checkCircle" size={48} />
              </div>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#1c2340",
                }}
              >
                {t("celebrer.intention.recueTitre")}
              </h3>
              <p
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.88rem",
                  color: "#6b7280",
                  marginTop: 8,
                }}
              >
                {t("celebrer.intention.recueTexte")}
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
                {t("celebrer.intention.nouvelle")}
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
                        value={person.nom}
                        onChange={(e) => setPerson({ ...person, nom: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.prenom")}>
                      <input
                        required
                        value={person.prenom}
                        onChange={(e) => setPerson({ ...person, prenom: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.email")}>
                      <input
                        type="email"
                        value={person.email}
                        onChange={(e) => setPerson({ ...person, email: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                    <Field label={t("extra.form.telephone")}>
                      <input
                        required
                        type="tel"
                        value={person.telephone}
                        onChange={(e) => setPerson({ ...person, telephone: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </Field>
                  </div>
                </FormStep>

                <FormStep
                  icon="calendar"
                  title={t("extra.form.messe")}
                  desc={t("extra.form.messeDesc")}
                >
                  <div className="space-y-8">
                    {requests.map((r, i) => {
                      const list = r.date ? massesByDate[r.date] : undefined
                      return (
                        <div
                          key={i}
                          className={i > 0 ? "pt-6 border-t border-dashed border-gray-200" : ""}
                        >
                          <Field label={t("extra.form.intentionTexte")}>
                            <textarea
                              required
                              rows={7}
                              value={r.description}
                              onChange={(e) => setRequest(i, { description: e.target.value })}
                              placeholder={t("celebrer.intention.descriptionPlaceholder")}
                              className={inputClass}
                              style={{ ...inputStyle, resize: "vertical" }}
                            />
                          </Field>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-5">
                            <Field label={t("extra.form.date")}>
                              <input
                                type="date"
                                min={localDateISO()}
                                value={r.date}
                                onChange={(e) => setRequest(i, { date: e.target.value, heure: "" })}
                                className={inputClass}
                                style={inputStyle}
                              />
                            </Field>
                            <Field label={t("extra.form.heure")}>
                              <select
                                value={r.heure}
                                disabled={!r.date || !list || list.length === 0}
                                required={!!r.date && !!list && list.length > 0}
                                onChange={(e) => setRequest(i, { heure: e.target.value })}
                                className={inputClass}
                                style={inputStyle}
                              >
                                {!r.date ? (
                                  <option value="">{t("extra.form.selectDate")}</option>
                                ) : !list ? (
                                  <option value="">{t("celebrer.intention.chargement")}</option>
                                ) : list.length === 0 ? (
                                  <option value="">{t("extra.form.aucuneMesse")}</option>
                                ) : (
                                  <>
                                    <option value="">{t("extra.form.choisir")}</option>
                                    {list.map((m) => (
                                      <option key={m.time} value={m.time}>
                                        {m.time} — {m.type}
                                        {m.note ? ` (${m.note})` : ""}
                                      </option>
                                    ))}
                                  </>
                                )}
                              </select>
                            </Field>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <PlusMinus
                    onAdd={() => setRequests((rs) => [...rs, { ...emptyMass }])}
                    onRemove={() => setRequests((rs) => rs.slice(0, -1))}
                    canRemove={requests.length > 1}
                    addLabel={t("extra.form.ajouter")}
                    removeLabel={t("extra.form.retirer")}
                  />
                </FormStep>

                <div className="pl-14">
                  <SubmitButton disabled={sending}>
                    {sending ? t("extra.form.envoi") : t("extra.form.envoyer")}
                  </SubmitButton>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
