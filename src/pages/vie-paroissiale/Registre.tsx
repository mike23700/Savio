import { useEffect, useState } from "react"

import { Link } from "react-router"

import { apiGet, apiPost, ApiError } from "@/lib/api"

import Icon from "@/components/Icon"

import { useLang } from "@/lib/i18n"

import { useAuth } from "@/lib/auth"

import {
  SACREMENTS,
  SACREMENT_QUESTIONS,
  type SacrementType,
} from "@/lib/sacrements"

const GROUPES: { value: string key: string }[] = [
  { value: "Conseil pastoral", key: "vie.registre.groupe.1" },

  { value: "Conseil des affaires économiques", key: "vie.registre.groupe.2" },

  { value: "Mouvements adultes", key: "vie.registre.groupe.3" },

  { value: "Mouvements jeunes", key: "vie.registre.groupe.4" },

  { value: "Groupes liturgiques", key: "vie.registre.groupe.5" },

  { value: "Communautés du Grand Nord", key: "vie.registre.groupe.6" },

  { value: "CHORALES", key: "vie.registre.groupe.7" },
]

const ORDER: SacrementType[] = [
  "bapteme",
  "communion",
  "confirmation",
  "mariage",
]

const RECAP = ORDER.length + 1

interface FormData {
  nom: string

  prenom: string

  email: string

  telephone: string

  trancheAge: string

  rue: string

  quartier: string

  lieuDit: string

  membreCEV: string

  quelleCEV: string

  membreGroupe: string

  quelGroupe: string

  anciennete: string
}

const EMPTY_FORM: FormData = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",

  trancheAge: "",
  rue: "",
  quartier: "",
  lieuDit: "",

  membreCEV: "",
  quelleCEV: "",
  membreGroupe: "",
  quelGroupe: "",
  anciennete: "",
}

export default function Registre() {
  const { t } = useLang()

  const { user, login, register } = useAuth()

  const [step, setStep] = useState(0)

  const [returnStep, setReturnStep] = useState<number | null>(null)

  const [form, setForm] = useState<FormData>(EMPTY_FORM)

  const [answers, setAnswers] =
    useState<Partial<Record<SacrementType, boolean>>>({})

  const [values, setValues] =
    useState<Partial<Record<SacrementType, Record<string, string>>>>({})

  const [submitted, setSubmitted] = useState(false)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [accountMode, setAccountMode] = useState<"register" | "login">(
    "register",
  )

  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    confirm: "",
  })

  useEffect(() => {
    if (step === RECAP && !user && !accountForm.email && form.email) {
      setAccountForm((prev) => ({ ...prev, email: form.email }))
    }
  }, [step, user, form.email, accountForm.email])

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const currentSacr: SacrementType | null =
    step >= 1 && step <= ORDER.length ? ORDER[step - 1] : null

  const ficheName = () => `${form.nom} ${form.prenom}`.trim()

  const answerOui = (type: SacrementType) => {
    setAnswers((prev) => ({ ...prev, [type]: true }))

    setValues((prev) => {
      const current = prev[type] ?? {}

      if (current.nom) return prev

      return { ...prev, [type]: { ...current, nom: ficheName() } }
    })

    prefillNumero(type)
  }

  const prefillNumero = (type: SacrementType) => {
    const def = SACREMENTS.find((s) => s.type === type)

    if (!def?.fields.some((f) => f.key === "numero_registre")) return

    apiGet<{ numero_registre: string }>(`/registre/next-numero?type=${type}`)

      .then((res) =>
        setValues((prev) => {
          const current = prev[type] ?? {}

          if (current.numero_registre) return prev

          return {
            ...prev,
            [type]: { ...current, numero_registre: res.numero_registre },
          }
        }),
      )

      .catch(() => {})
  }

  const answerNon = (index: number) => {
    setAnswers((prev) => {
      const next = { ...prev }

      for (let i = index; i < ORDER.length; i++) delete next[ORDER[i]]

      return next
    })

    setValues((prev) => {
      const next = { ...prev }

      for (let i = index; i < ORDER.length; i++) delete next[ORDER[i]]

      return next
    })

    setReturnStep(index + 1)

    setStep(RECAP)
  }

  const setValue = (type: SacrementType, key: string, value: string) =>
    setValues((prev) => ({
      ...prev,
      [type]: { ...(prev[type] ?? {}), [key]: value },
    }))

  const nextFromSacrement = (e: React.FormEvent) => {
    e.preventDefault()

    if (step >= ORDER.length) {
      setReturnStep(null)

      setStep(RECAP)
    } else {
      setStep(step + 1)
    }
  }

  const submitAll = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)

    setSaving(true)

    try {
      if (!user) {
        const email = (accountForm.email || form.email).trim()

        if (!email) {
          setError(t("vie.registre.compte.email"))

          return
        }

        if (accountMode === "register") {
          if (accountForm.password !== accountForm.confirm) {
            setError(t("top.membre.motsDePasseDifferents"))

            return
          }

          await register({
            nom: form.nom,

            prenom: form.prenom,

            email,

            phone: form.telephone || undefined,

            password: accountForm.password,

            password_confirmation: accountForm.confirm,
          })
        } else {
          await login(email, accountForm.password)
        }
      }

      const sacrements = ORDER.filter((type) => answers[type]).map((type) => {
        const def = SACREMENTS.find((s) => s.type === type)!

        const payload: Record<string, string | null> = { type }

        for (const f of def.fields) {
          const v = (values[type]?.[f.key] ?? "").trim()

          payload[f.key] = v === "" ? null : v
        }

        return payload
      })

      await apiPost("/registre", {
        nom: form.nom,

        prenom: form.prenom,

        email: form.email || accountForm.email || null,

        telephone: form.telephone,

        tranche_age: form.trancheAge,

        rue: form.rue || null,

        quartier: form.quartier,

        lieu_dit: form.lieuDit || null,

        membre_cev: form.membreCEV === "oui",

        quelle_cev: form.quelleCEV || null,

        membre_groupe: form.membreGroupe === "oui",

        quel_groupe: form.quelGroupe || null,

        anciennete: form.anciennete,

        sacrements,
      })

      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && !user) {
        setError(
          accountMode === "register"
            ? t("vie.registre.compte.erreur")
            : t("vie.registre.compte.connexionErreur"),
        )
      } else {
        setError(
          err instanceof ApiError ? err.message : t("vie.registre.erreur"),
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"

  const inputStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.85rem",
    color: "#1c2340",
  }

  const labelStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 600 as const,
    color: "#374151",
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">
          <Icon name="checkCircle" size={56} />
        </div>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#1c2340",
          }}
        >
          {t("vie.registre.merci")}
        </h2>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            color: "#6b7280",
            marginTop: 8,
            lineHeight: 1.7,
          }}
        >
          {user
            ? t("vie.registre.merciCompteTexte")
            : t("vie.registre.merciTexte")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {user && (
            <Link
              to="/espace-paroissien"
              style={{
                background: "#0B3D91",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.83rem",
              }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <Icon name="user" size={16} /> {t("vie.registre.voirEspace")}
            </Link>
          )}
          <Link
            to="/vie-paroissiale"
            style={{
              background: user ? "#fff" : "#0B3D91",
              border: "1px solid #e5e7eb",
              color: user ? "#374151" : "#fff",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.83rem",
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <Icon name="arrowLeft" size={16} /> {t("vie.titre")}
          </Link>
        </div>
      </div>
    )
  }

  const progress = Math.round((step / RECAP) * 100)

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1774685398923-ba001b371579?w=1400&h=500&fit=crop&auto=format"
          alt={t("vie.registre.titre")}
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
              to="/vie-paroissiale"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("vie.titre")}
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
              {t("vie.registre.titre")}
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
            {t("vie.registre.titre")}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("vie.registre.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#D4AF37",
              letterSpacing: "0.15em",
            }}
            className="mb-2"
          >
            {t("vie.registre.kicker")}
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1c2340",
              marginBottom: 8,
            }}
          >
            {t("vie.registre.h2")}
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.88rem",
              color: "#6b7280",
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            {t("vie.registre.wizard.intro")}
          </p>

          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-8">
            <div
              style={{
                width: `${progress}%`,
                background: "#0B3D91",
                transition: "width 0.3s ease",
              }}
              className="h-full"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {step === 0 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep(1)
                }}
                className="space-y-6"
              >
                <div>
                  <h3 style={sectionTitle}>
                    {t("vie.registre.section.identite")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.nom")}
                      </label>
                      <input
                        required
                        value={form.nom}
                        onChange={set("nom")}
                        placeholder={t("vie.registre.ph.nom")}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.prenom")}
                      </label>
                      <input
                        required
                        value={form.prenom}
                        onChange={set("prenom")}
                        placeholder={t("vie.registre.ph.prenom")}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.email")}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="votre@email.com"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.telephone")}
                      </label>
                      <input
                        required
                        value={form.telephone}
                        onChange={set("telephone")}
                        placeholder="(+237) 6XX XXX XXX"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label style={labelStyle} className="block mb-1.5">
                      {t("vie.registre.label.trancheAge")}
                    </label>
                    <select
                      required
                      value={form.trancheAge}
                      onChange={set("trancheAge")}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="">
                        {t("vie.registre.select.selectionner")}
                      </option>
                      <option value="0-14">{t("vie.registre.age.a")}</option>
                      <option value="15-24">{t("vie.registre.age.b")}</option>
                      <option value="25-64">{t("vie.registre.age.c")}</option>
                      <option value="65+">{t("vie.registre.age.d")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 style={sectionTitle}>
                    {t("vie.registre.section.adresse")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.rue")}
                      </label>
                      <input
                        value={form.rue}
                        onChange={set("rue")}
                        placeholder={t("vie.registre.ph.rue")}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle} className="block mb-1.5">
                          {t("vie.registre.label.quartier")}
                        </label>
                        <input
                          required
                          value={form.quartier}
                          onChange={set("quartier")}
                          placeholder={t("vie.registre.ph.quartier")}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle} className="block mb-1.5">
                          {t("vie.registre.label.lieuDit")}
                        </label>
                        <input
                          value={form.lieuDit}
                          onChange={set("lieuDit")}
                          placeholder={t("vie.registre.ph.lieuDit")}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={sectionTitle}>{t("vie.registre.section.cev")}</h3>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">
                      {t("vie.registre.label.membreCev")}
                    </label>
                    <select
                      required
                      value={form.membreCEV}
                      onChange={set("membreCEV")}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="">
                        {t("vie.registre.select.selectionner")}
                      </option>
                      <option value="oui">{t("vie.registre.oui")}</option>
                      <option value="non">{t("vie.registre.non")}</option>
                    </select>
                  </div>
                  {form.membreCEV === "oui" && (
                    <div className="mt-4">
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.quelleCev")}
                      </label>
                      <input
                        value={form.quelleCEV}
                        onChange={set("quelleCEV")}
                        placeholder={t("vie.registre.ph.cev")}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={sectionTitle}>
                    {t("vie.registre.section.groupe")}
                  </h3>
                  <div>
                    <label style={labelStyle} className="block mb-1.5">
                      {t("vie.registre.label.membreGroupe")}
                    </label>
                    <select
                      required
                      value={form.membreGroupe}
                      onChange={set("membreGroupe")}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="">
                        {t("vie.registre.select.selectionner")}
                      </option>
                      <option value="oui">{t("vie.registre.oui")}</option>
                      <option value="non">{t("vie.registre.non")}</option>
                    </select>
                  </div>
                  {form.membreGroupe === "oui" && (
                    <div className="mt-4">
                      <label style={labelStyle} className="block mb-1.5">
                        {t("vie.registre.label.quelGroupe")}
                      </label>
                      <select
                        value={form.quelGroupe}
                        onChange={set("quelGroupe")}
                        className={inputClass}
                        style={inputStyle}
                      >
                        <option value="">
                          {t("vie.registre.select.selectionner")}
                        </option>
                        {GROUPES.map((g) => (
                          <option key={g.value} value={g.value}>
                            {t(g.key)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle} className="block mb-1.5">
                    {t("vie.registre.label.anciennete")}
                  </label>
                  <select
                    required
                    value={form.anciennete}
                    onChange={set("anciennete")}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">
                      {t("vie.registre.select.selectionner")}
                    </option>
                    <option value="moins2">
                      {t("vie.registre.anciennete.moins2")}
                    </option>
                    <option value="2-5">
                      {t("vie.registre.anciennete.deux5")}
                    </option>
                    <option value="5-10">
                      {t("vie.registre.anciennete.cinq10")}
                    </option>
                    <option value="plus10">
                      {t("vie.registre.anciennete.plus10")}
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={primaryBtn}
                  className="w-full text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  {t("vie.registre.wizard.continuer")}{" "}
                  <Icon name="arrowRight" size={16} strokeWidth={1.75} />
                </button>
              </form>
            )}

            {currentSacr && (
              <SacrementStep
                key={currentSacr}
                type={currentSacr}
                index={step - 1}
                value={values[currentSacr] ?? {}}
                answered={answers[currentSacr]}
                t={t}
                inputClass={inputClass}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                onOui={() => answerOui(currentSacr)}
                onNon={() => answerNon(step - 1)}
                onValue={(key, value) => setValue(currentSacr, key, value)}
                onNext={nextFromSacrement}
                onBack={() => setStep(step - 1)}
              />
            )}

            {step === RECAP && (
              <form onSubmit={submitAll} className="space-y-6">
                <div>
                  <h3 style={sectionTitle}>{t("vie.registre.wizard.recap")}</h3>
                  <p
                    style={{ ...labelStyle, fontWeight: 400, marginBottom: 16 }}
                  >
                    {t("vie.registre.wizard.recapIntro")}
                  </p>
                  <div
                    className="space-y-2"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.85rem",
                      color: "#374151",
                    }}
                  >
                    <div>
                      {t("vie.registre.label.nom")} :{" "}
                      <strong>{form.nom}</strong>
                    </div>
                    <div>
                      {t("vie.registre.label.prenom")} :{" "}
                      <strong>{form.prenom}</strong>
                    </div>
                    {form.telephone && (
                      <div>
                        {t("vie.registre.label.telephone")} :{" "}
                        <strong>{form.telephone}</strong>
                      </div>
                    )}
                    {form.quartier && (
                      <div>
                        {t("vie.registre.label.quartier")} :{" "}
                        <strong>{form.quartier}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {ORDER.filter((type) => answers[type]).length === 0 ? (
                    <p style={{ ...labelStyle, fontWeight: 400 }}>
                      {t("vie.registre.wizard.aucunSacrement")}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {ORDER.filter((type) => answers[type]).map((type) => {
                        const def = SACREMENTS.find((s) => s.type === type)!

                        return (
                          <div
                            key={type}
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 12,
                              padding: 16,
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Playfair Display, serif",
                                fontWeight: 700,
                                color: "#1c2340",
                                marginBottom: 8,
                              }}
                            >
                              {t(def.labelKey)}
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(180px, 1fr))",
                                gap: "4px 16px",
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: "0.8rem",
                                color: "#374151",
                              }}
                            >
                              {def.fields.map((f) => {
                                const v = (values[type]?.[f.key] ?? "").trim()

                                if (!v) return null

                                const label = t(f.labelKey)

                                let display = v

                                if (f.kind === "radio") {
                                  const opt = f.options?.find(
                                    (o) => o.value === v,
                                  )

                                  if (opt) display = t(opt.labelKey)
                                }

                                return (
                                  <div key={f.key}>
                                    <span style={{ color: "#9ca3af" }}>
                                      {label} :{" "}
                                    </span>
                                    {display}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {!user && (
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <h3 style={sectionTitle}>
                      {t("vie.registre.compte.titre")}
                    </h3>
                    <p
                      style={{
                        ...labelStyle,
                        fontWeight: 400,
                        marginBottom: 12,
                        lineHeight: 1.6,
                      }}
                    >
                      {t("vie.registre.compte.intro")}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label style={labelStyle} className="block mb-1.5">
                          {t("vie.registre.compte.email")}
                        </label>
                        <input
                          required
                          type="email"
                          value={accountForm.email}
                          onChange={(e) =>
                            setAccountForm((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle} className="block mb-1.5">
                          {t("vie.registre.compte.motDePasse")}
                        </label>
                        <input
                          required
                          type="password"
                          minLength={8}
                          value={accountForm.password}
                          onChange={(e) =>
                            setAccountForm((p) => ({
                              ...p,
                              password: e.target.value,
                            }))
                          }
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      {accountMode === "register" && (
                        <div>
                          <label style={labelStyle} className="block mb-1.5">
                            {t("vie.registre.compte.confirmation")}
                          </label>
                          <input
                            required
                            type="password"
                            value={accountForm.confirm}
                            onChange={(e) =>
                              setAccountForm((p) => ({
                                ...p,
                                confirm: e.target.value,
                              }))
                            }
                            className={inputClass}
                            style={inputStyle}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMode((m) =>
                          m === "register" ? "login" : "register",
                        )
                        setError(null)
                      }}
                      style={{
                        ...labelStyle,
                        color: "#0B3D91",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginTop: 12,
                        textDecoration: "underline",
                      }}
                    >
                      {accountMode === "register"
                        ? t("vie.registre.compte.deja")
                        : t("vie.registre.compte.nouveau")}
                    </button>
                  </div>
                )}

                {error && <ErrorBox message={error} />}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(returnStep ?? ORDER.length)}
                    style={secondaryBtn}
                    className="sm:w-auto px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Icon name="arrowLeft" size={16} />{" "}
                    {t("vie.registre.wizard.retour")}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}
                    className="flex-1 text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {user
                      ? t("vie.registre.submit")
                      : accountMode === "register"
                        ? t("vie.registre.compte.creer")
                        : t("vie.registre.compte.seConnecter")}{" "}
                    <Icon name="cross" size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function SacrementStep({
  type,
  index,
  value,
  answered,
  t,
  inputClass,
  inputStyle,
  labelStyle,
  onOui,
  onNon,
  onValue,
  onNext,
  onBack,
}: {
  type: SacrementType

  index: number

  value: Record<string, string>

  answered: boolean | undefined

  t: (key: string) => string

  inputClass: string

  inputStyle: React.CSSProperties

  labelStyle: React.CSSProperties

  onOui: () => void

  onNon: () => void

  onValue: (key: string, value: string) => void

  onNext: (e: React.FormEvent) => void

  onBack: () => void
}) {
  const def = SACREMENTS.find((s) => s.type === type)!

  const last = index === ORDER.length - 1

  const isNom = (key: string) => key === "nom"

  if (!answered) {
    return (
      <div className="space-y-6">
        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#1c2340",
          }}
        >
          {t(SACREMENT_QUESTIONS[type])}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onOui}
            style={primaryBtn}
            className="flex-1 text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t("vie.registre.oui")}
          </button>
          <button
            type="button"
            onClick={onNon}
            style={secondaryBtn}
            className="flex-1 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("vie.registre.non")}
          </button>
        </div>
        {index > 0 && (
          <button
            type="button"
            onClick={onBack}
            style={{
              ...labelStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <Icon name="arrowLeft" size={14} />{" "}
            {t("vie.registre.wizard.retour")}
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onNext} className="space-y-6">
      <h3
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "#1c2340",
        }}
      >
        {t(def.labelKey)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {def.fields.map((f) => {
          const wide = f.kind === "textarea"

          return (
            <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
              <label style={labelStyle} className="block mb-1.5">
                {t(f.labelKey)}
                {f.required ? " *" : ""}
              </label>
              {f.kind === "textarea" ? (
                <textarea
                  required={f.required}
                  rows={3}
                  value={value[f.key] ?? ""}
                  onChange={(e) => onValue(f.key, e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              ) : f.kind === "radio" ? (
                <select
                  required={f.required}
                  value={value[f.key] ?? ""}
                  onChange={(e) => onValue(f.key, e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">
                    {t("vie.registre.select.selectionner")}
                  </option>
                  {(f.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(o.labelKey)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required={f.required}
                  readOnly={isNom(f.key)}
                  type={f.kind === "date" ? "date" : "text"}
                  value={value[f.key] ?? ""}
                  onChange={
                    isNom(f.key)
                      ? undefined
                      : (e) => onValue(f.key, e.target.value)
                  }
                  className={inputClass}
                  style={inputStyle}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          style={secondaryBtn}
          className="sm:w-auto px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Icon name="arrowLeft" size={16} /> {t("vie.registre.wizard.retour")}
        </button>
        <button
          type="submit"
          style={primaryBtn}
          className="flex-1 text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          {last
            ? t("vie.registre.wizard.recap")
            : t("vie.registre.wizard.continuer")}{" "}
          <Icon name="arrowRight" size={16} strokeWidth={1.75} />
        </button>
      </div>
    </form>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3"
      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem" }}
    >
      {message}
    </div>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "Playfair Display, serif",
  fontSize: "1rem",
  fontWeight: 700,
  color: "#1c2340",
  marginBottom: 16,
}

const primaryBtn: React.CSSProperties = {
  background: "#0B3D91",
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  fontSize: "0.85rem",
}

const secondaryBtn: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  color: "#374151",
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  fontSize: "0.85rem",
}
