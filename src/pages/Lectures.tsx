import { useEffect, useState } from "react"

import { useBanner } from "@/lib/banner"

import { Link, useSearchParams } from "react-router"

import { apiGet, localDateISO, mediaUrl } from "@/lib/api"

import {
  readingsList,
  type DailyReadings,
  type ReadingText,
} from "@/lib/content-types"

import Icon from "@/components/Icon"

import { useLang } from "@/lib/i18n"

const font = { fontFamily: "Montserrat, sans-serif" }

interface DayHomelie {
  id: number
  title: string
  slug: string
  priest: string
  excerpt: string | null
  audio_url: string | null
}

interface DayMass {
  time: string
  type: string
  note: string | null
}

const COLOR: Record<string, string> = {
  vert: "#15803d",

  violet: "#7e22ce",

  rouge: "#b91c1c",

  blanc: "#D4AF37",

  rose: "#db2777",

  noir: "#1c2340",
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`)

  d.setDate(d.getDate() + days)

  return localDateISO(d)
}

function ReadingBlock({ text }: { text: ReadingText }) {
  return (
    <article className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2
          style={{
            ...font,
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#D4AF37",
            letterSpacing: "0.12em",
          }}
        >
          {text.label.toUpperCase()}
        </h2>
        {text.ref && (
          <span
            style={{
              ...font,
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#0B3D91",
            }}
          >
            {text.ref}
          </span>
        )}
      </div>
      {text.title && (
        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#1c2340",
            marginBottom: 6,
            lineHeight: 1.4,
          }}
        >
          {text.title}
        </h3>
      )}
      {text.intro && (
        <p
          style={{
            ...font,
            fontSize: "0.82rem",
            fontStyle: "italic",
            color: "#6b7280",
            marginBottom: 12,
          }}
        >
          {text.intro}
        </p>
      )}
      {text.refrain && (
        <p
          style={{
            ...font,
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#0B3D91",
            marginBottom: 12,
          }}
        >
          R/ {text.refrain}
        </p>
      )}
      {text.acclamation && (
        <div
          className="reading-text bg-yellow-50 rounded-xl px-4 py-3 mb-4"
          style={{
            ...font,
            fontSize: "0.85rem",
            color: "#92400e",
            lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{ __html: text.acclamation }}
        />
      )}
      {text.format === "html" ? (
        <div
          className="reading-text"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1rem",
            color: "#1f2937",
            lineHeight: 1.85,
          }}
          dangerouslySetInnerHTML={{ __html: text.content }}
        />
      ) : (
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1rem",
            color: "#1f2937",
            lineHeight: 1.85,
            whiteSpace: "pre-line",
          }}
        >
          {text.content}
        </p>
      )}
    </article>
  )
}

export default function Lectures() {
  const banner = useBanner("lectures")

  const { t, lang } = useLang()

  const [params, setParams] = useSearchParams()

  const today = localDateISO()

  const dateParam = params.get("date")

  const date =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today

  const [readings, setReadings] = useState<DailyReadings | null | undefined>(
    undefined,
  )

  const [activeTab, setActiveTab] = useState(0)

  const [homelie, setHomelie] = useState<DayHomelie | null>(null)

  const [masses, setMasses] = useState<DayMass[] | null>(null)

  useEffect(() => {
    setReadings(undefined)
    setActiveTab(0)
    apiGet<DailyReadings | null>(`/lectures/jour?date=${date}`)
      .then(setReadings)
      .catch(() => setReadings(null))
    setHomelie(null)
    apiGet<DayHomelie[]>(`/homelies?date=${date}`)
      .then((list) => setHomelie(list[0] ?? null))
      .catch(() => {})
    setMasses(null)
    apiGet<DayMass[]>(`/mass-schedule/day?date=${date}`)
      .then(setMasses)
      .catch(() => setMasses([]))
  }, [date])

  const goTo = (iso: string) => setParams(iso === today ? {} : { date: iso })

  const dateLong = new Date(`${date}T12:00:00`).toLocaleDateString(
    lang === "en" ? "en-GB" : "fr-FR",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  )

  const texts = readings?.texts ?? []

  const refs = readingsList(readings ?? null)

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img
          src={banner}
          alt={t("nourrir.lectures.titre")}
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
                ...font,
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
              to="/se-nourrir"
              style={{
                ...font,
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("nav.nourrir")}
            </Link>
            <Icon
              name="chevronRight"
              size={13}
              strokeWidth={1.75}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            <span style={{ ...font, fontSize: "0.72rem", color: "#D4AF37" }}>
              {t("nourrir.lectures.titre")}
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
            {t("nourrir.lectures.titre")}
          </h1>
          <p
            style={{
              ...font,
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("nourrir.lectures.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-10 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          {/* Day navigation */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => goTo(shiftDate(date, -1))}
              style={{
                ...font,
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#0B3D91",
              }}
              className="px-3 py-2 rounded-full hover:bg-blue-50 inline-flex items-center gap-1"
            >
              <Icon name="arrowLeft" size={14} strokeWidth={1.75} />{" "}
              {t("nourrir.lectures.veille")}
            </button>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <input
                type="date"
                value={date}
                onChange={(e) => e.target.value && goTo(e.target.value)}
                aria-label={t("nourrir.lectures.choisirDate")}
                className="border border-gray-200 rounded-xl px-3 py-2"
                style={{ ...font, fontSize: "0.82rem", color: "#1c2340" }}
              />
              {date !== today && (
                <button
                  onClick={() => goTo(today)}
                  style={{
                    ...font,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#D4AF37",
                  }}
                  className="hover:underline"
                >
                  {t("nourrir.lectures.aujourdhui")}
                </button>
              )}
            </div>
            <button
              onClick={() => goTo(shiftDate(date, 1))}
              style={{
                ...font,
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#0B3D91",
              }}
              className="px-3 py-2 rounded-full hover:bg-blue-50 inline-flex items-center gap-1"
            >
              {t("nourrir.lectures.lendemain")}{" "}
              <Icon name="arrowRight" size={14} strokeWidth={1.75} />
            </button>
          </div>

          <div className="mb-6">
            <div
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1c2340",
                textTransform: "capitalize",
              }}
            >
              {dateLong}
            </div>
            {readings?.liturgical_day && (
              <div className="flex items-center gap-2 mt-1">
                {readings.color && (
                  <span
                    title={t("nourrir.lectures.couleurLiturgique").replace(
                      "{color}",
                      readings.color,
                    )}
                    className="inline-block w-3 h-3 rounded-full border border-gray-200"
                    style={{
                      background:
                        COLOR[readings.color.toLowerCase()] ?? "#9ca3af",
                    }}
                  />
                )}
                <span
                  style={{ ...font, fontSize: "0.88rem", color: "#4b5563" }}
                >
                  {readings.liturgical_day}
                </span>
              </div>
            )}
          </div>

          {readings === undefined ? (
            <p style={{ ...font, fontSize: "0.85rem", color: "#9ca3af" }}>
              {t("nourrir.lectures.chargement")}
            </p>
          ) : texts.length > 0 ? (
            <div>
              {/* One tab per text (1re lecture, psaume, évangile…) to keep the page short */}
              <div
                role="tablist"
                className="flex gap-2 overflow-x-auto pb-1 mb-4"
              >
                {texts.map((text, i) => (
                  <button
                    key={`${text.type}-${i}`}
                    role="tab"
                    aria-selected={activeTab === i}
                    onClick={() => setActiveTab(i)}
                    style={{
                      ...font,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: activeTab === i ? "#0B3D91" : "white",
                      color: activeTab === i ? "white" : "#374151",
                      border: `1px solid ${activeTab === i ? "#0B3D91" : "#e5e7eb"}`,
                    }}
                    className="px-4 py-2 rounded-full whitespace-nowrap hover:opacity-90 transition-all"
                  >
                    {text.label}
                  </button>
                ))}
              </div>
              {texts[activeTab] && (
                <ReadingBlock
                  key={`${texts[activeTab].type}-${activeTab}`}
                  text={texts[activeTab]}
                />
              )}
            </div>
          ) : refs.length > 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              {refs.map((r) => (
                <div
                  key={r.label}
                  className="flex gap-3 mb-2 last:mb-0"
                  style={{ ...font, fontSize: "0.88rem" }}
                >
                  <span
                    style={{ fontWeight: 700, color: "#0B3D91", minWidth: 110 }}
                  >
                    {r.label}
                  </span>
                  <span style={{ color: "#374151" }}>{r.value}</span>
                </div>
              ))}
              {readings?.gospel_title && (
                <p
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    color: "#4b5563",
                    marginTop: 10,
                  }}
                >
                  {readings.gospel_title}
                </p>
              )}
              <p
                style={{
                  ...font,
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                  marginTop: 14,
                }}
              >
                {t("nourrir.lectures.texteIndisponible")}
              </p>
            </div>
          ) : (
            <p style={{ ...font, fontSize: "0.85rem", color: "#6b7280" }}>
              {t("nourrir.lectures.indisponibles")}
            </p>
          )}

          {/* Homily and masses of the day */}
          <div className="grid gap-5 md:grid-cols-2 mt-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3
                className="flex items-center gap-2 mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1c2340",
                }}
              >
                <Icon name="mic" size={18} strokeWidth={1.75} style={{ color: "#D4AF37" }} />
                {t("extra.lectures.homelie")}
              </h3>
              {homelie ? (
                <>
                  <div style={{ ...font, fontSize: "0.9rem", fontWeight: 700, color: "#0B3D91" }}>
                    {homelie.title}
                  </div>
                  <div style={{ ...font, fontSize: "0.75rem", color: "#9ca3af", marginTop: 2 }}>
                    {homelie.priest}
                  </div>
                  {homelie.excerpt && (
                    <p
                      className="line-clamp-4"
                      style={{ ...font, fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6, marginTop: 8 }}
                    >
                      {homelie.excerpt}
                    </p>
                  )}
                  {mediaUrl(homelie.audio_url) && (
                    <audio
                      controls
                      preload="none"
                      src={mediaUrl(homelie.audio_url)!}
                      className="w-full mt-3"
                    />
                  )}
                  <Link
                    to={`/homelies?h=${encodeURIComponent(homelie.slug)}`}
                    style={{ ...font, fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91" }}
                    className="inline-flex items-center gap-1 mt-3 hover:underline"
                  >
                    {t("extra.lectures.lireHomelie")}
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </>
              ) : (
                <p style={{ ...font, fontSize: "0.82rem", color: "#9ca3af" }}>
                  —
                </p>
              )}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3
                className="flex items-center gap-2 mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1c2340",
                }}
              >
                <Icon name="clock" size={18} strokeWidth={1.75} style={{ color: "#D4AF37" }} />
                {t("extra.lectures.messesDuJour")}
              </h3>
              {masses === null ? (
                <p style={{ ...font, fontSize: "0.82rem", color: "#9ca3af" }}>
                  {t("nourrir.lectures.chargement")}
                </p>
              ) : masses.length === 0 ? (
                <p style={{ ...font, fontSize: "0.82rem", color: "#9ca3af" }}>
                  {t("extra.lectures.aucuneMesse")}
                </p>
              ) : (
                <ul className="space-y-2">
                  {masses.map((m, i) => (
                    <li key={`${m.time}-${i}`} className="flex items-baseline gap-3">
                      <span
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          color: "#0B3D91",
                          minWidth: 58,
                        }}
                      >
                        {m.time}
                      </span>
                      <span style={{ ...font, fontSize: "0.82rem", color: "#1c2340" }}>
                        {m.type}
                        {m.note && (
                          <span style={{ color: "#9ca3af" }}> · {m.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/homelies"
              style={{
                background: "#0B3D91",
                ...font,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
              className="text-white px-5 py-2.5 rounded-full hover:opacity-90"
            >
              {t("nourrir.lectures.ecouterHomelie")}
            </Link>
            <Link
              to="/celebrer/messes"
              style={{
                border: "2px solid #0B3D91",
                color: "#0B3D91",
                ...font,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
              className="px-5 py-2.5 rounded-full hover:bg-blue-50"
            >
              {t("nourrir.lectures.messes")}
            </Link>
          </div>
          {readings?.source === "aelf" && (
            <p
              style={{
                ...font,
                fontSize: "0.7rem",
                color: "#9ca3af",
                marginTop: 16,
              }}
            >
              {t("nourrir.lectures.sourceAelf")}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
