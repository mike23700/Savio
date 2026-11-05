import { useState } from "react"

import { apiPost, ApiError } from "@/lib/api"

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

interface Personne {
  nom: string
  prenom: string
  age: string
}

const emptyPersonne: Personne = { nom: "", prenom: "", age: "" }

const emptyApplicant = { nom: "", prenom: "", email: "", telephone: "" }

/**
 * "Formulaire de demande" shown under the list of sacraments: the applicant,
 * the sacrament requested and the people concerned (− / + to remove / add
 * rows). Saved through POST /api/sacrements/demandes, followed up in
 * /admin/demandes-sacrements.
 */
export default function SacrementRequestForm({
  sacrements,
  defaultSacrementId,
}: {
  sacrements: { id: number; title: string }[]
  defaultSacrementId?: number
}) {
  const { t } = useLang()

  const [applicant, setApplicant] = useState(emptyApplicant)

  const [sacrementId, setSacrementId] = useState(
    defaultSacrementId ? String(defaultSacrementId) : "",
  )

  const [personnes, setPersonnes] = useState<Personne[]>([{ ...emptyPersonne }])

  const [message, setMessage] = useState("")

  const [sending, setSending] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [done, setDone] = useState(false)

  const setPersonne = (i: number, patch: Partial<Personne>) =>
    setPersonnes((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      await apiPost("/sacrements/demandes", {
        ...applicant,
        email: applicant.email || null,
        sacrement_id: sacrementId ? Number(sacrementId) : null,
        personnes: personnes.map((p) => ({
          nom: p.nom,
          prenom: p.prenom,
          age: p.age === "" ? null : Number(p.age),
        })),
        message: message || null,
      })
      setApplicant(emptyApplicant)
      setPersonnes([{ ...emptyPersonne }])
      setMessage("")
      setDone(true)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? Object.values(err.errors ?? {})[0]?.[0] || err.message
          : t("extra.form.erreur"),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} id="formulaire-demande">
      <FormTitle>{t("extra.form.titre")}</FormTitle>
      {done && <FormMessage kind="success">{t("extra.form.succes")}</FormMessage>}
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
                value={applicant.nom}
                onChange={(e) => setApplicant({ ...applicant, nom: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label={t("extra.form.prenom")}>
              <input
                required
                value={applicant.prenom}
                onChange={(e) => setApplicant({ ...applicant, prenom: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label={t("extra.form.email")}>
              <input
                type="email"
                value={applicant.email}
                onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label={t("extra.form.telephone")}>
              <input
                required
                type="tel"
                value={applicant.telephone}
                onChange={(e) => setApplicant({ ...applicant, telephone: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            {sacrements.length > 0 && (
              <Field label={t("extra.form.sacrement")} className="sm:col-span-2">
                <select
                  value={sacrementId}
                  onChange={(e) => setSacrementId(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">{t("extra.form.choisir")}</option>
                  {sacrements.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        </FormStep>

        <FormStep
          icon="info"
          title={t("extra.form.personnes")}
          desc={t("extra.form.personnesDesc")}
        >
          <div className="space-y-5">
            {personnes.map((p, i) => (
              <div
                key={i}
                className="grid gap-x-8 gap-y-3"
                style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 108px" }}
              >
                <Field label={t("extra.form.nom")}>
                  <input
                    required
                    value={p.nom}
                    onChange={(e) => setPersonne(i, { nom: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </Field>
                <Field label={t("extra.form.prenom")}>
                  <input
                    required
                    value={p.prenom}
                    onChange={(e) => setPersonne(i, { prenom: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </Field>
                <Field label={t("extra.form.age")}>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={p.age}
                    onChange={(e) => setPersonne(i, { age: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </Field>
              </div>
            ))}
          </div>
          <PlusMinus
            onAdd={() => setPersonnes((ps) => [...ps, { ...emptyPersonne }])}
            onRemove={() => setPersonnes((ps) => ps.slice(0, -1))}
            canRemove={personnes.length > 1}
            addLabel={t("extra.form.ajouter")}
            removeLabel={t("extra.form.retirer")}
          />
          <Field label={t("extra.form.message")} className="mt-4">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
        </FormStep>

        <div className="pl-14">
          <SubmitButton disabled={sending}>
            {sending ? t("extra.form.envoi") : t("extra.form.envoyer")}
          </SubmitButton>
        </div>
      </div>
    </form>
  )
}
