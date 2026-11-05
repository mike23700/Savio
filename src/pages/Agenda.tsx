import { useEffect, useState } from "react"

import { useBanner } from "@/lib/banner"

import { Link } from "react-router"

import { apiGet, localDateISO } from "@/lib/api"

import {
  formatEventTime,
  type EventCategory,
  type ParishEvent,
} from "@/lib/content-types"

import { useLang } from "@/lib/i18n"

import Icon from "@/components/Icon"

const ALL = "*"

const PAST_PAGE = 20

export default function Agenda() {
  const banner = useBanner("agenda")

  const { t, lang } = useLang()

  const locale = lang === "en" ? "en-GB" : "fr-FR"

  const [activeCat, setActiveCat] = useState(ALL)

  const [upcoming, setUpcoming] = useState<ParishEvent[]>([])

  const [past, setPast] = useState<ParishEvent[]>([])

  const [pastShown, setPastShown] = useState(PAST_PAGE)

  const [categories, setCategories] = useState<EventCategory[]>([])

  const [loading, setLoading] = useState(true)

  // The visitor's local date (their device clock) splits upcoming / past.
  const today = localDateISO()

  useEffect(() => {
    apiGet<EventCategory[]>("/event-categories")
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiGet<ParishEvent[]>(`/events?from=${today}`).catch(() => []),
      apiGet<ParishEvent[]>(`/events?from=${today}&past=1`).catch(() => []),
    ])
      .then(([up, old]) => {
        setUpcoming(up)
        setPast(old)
      })
      .finally(() => setLoading(false))
  }, [today])

  useEffect(() => setPastShown(PAST_PAGE), [activeCat])

  const CATEGORIES = [
    { value: ALL, label: t("top.common.tous") },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ]

  const colorOf = (name: string | undefined) =>
    categories.find((c) => c.name === name)?.color

  const inCat = (e: ParishEvent) =>
    activeCat === ALL || e.category?.name === activeCat

  const upcomingFiltered = upcoming.filter(inCat)

  const pastFiltered = past.filter(inCat)

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString(locale, opts)

  const formatDate = (iso: string) =>
    fmt(iso, { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  /** "Du 12 au 14 novembre 2026" for a multi-day event. */
  const formatRange = (ev: ParishEvent) => {
    const start = ev.date.slice(0, 10)
    const end = ev.end_date!.slice(0, 10)
    const sameYear = start.slice(0, 4) === end.slice(0, 4)
    const sameMonth = sameYear && start.slice(5, 7) === end.slice(5, 7)
    const from = fmt(start, {
      day: "numeric",
      ...(sameMonth ? {} : { month: "long" }),
      ...(sameYear ? {} : { year: "numeric" }),
    })
    const to = fmt(end, { day: "numeric", month: "long", year: "numeric" })
    return `${t("extra.agenda.du")} ${from} ${t("extra.agenda.au")} ${to}`
  }

  /**
   * Upcoming events are grouped by day; a multi-day event that already
   * started is shown under today's date with an "Ongoing" badge.
   */
  function group(list: ParishEvent[], isPast: boolean) {
    const map: Record<string, ParishEvent[]> = {}
    for (const ev of list) {
      const start = ev.date.slice(0, 10)
      const key = !isPast && start < today ? today : start
      ;(map[key] ??= []).push(ev)
    }
    return Object.entries(map).sort(([a], [b]) =>
      isPast ? b.localeCompare(a) : a.localeCompare(b),
    )
  }

  function EventRow({ ev, isPast }: { ev: ParishEvent; isPast: boolean }) {
    const multiDay = !!ev.end_date && ev.end_date.slice(0, 10) !== ev.date.slice(0, 10)
    const ongoing = !isPast && ev.date.slice(0, 10) < today
    const timeLabel = multiDay
      ? formatEventTime(ev.time)
      : [formatEventTime(ev.time), formatEventTime(ev.end_time)]
          .filter(Boolean)
          .join(" – ")
    return (
      <div
        className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:border-yellow-200 hover:shadow-sm transition-all"
        style={isPast ? { opacity: 0.85 } : undefined}
      >
        <div
          style={{
            minWidth: 56,
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#0B3D91",
          }}
        >
          {timeLabel}
        </div>
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#1c2340",
            }}
          >
            {ev.title}
          </div>
          {multiDay && (
            <div
              className="flex items-center gap-1.5 flex-wrap"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.74rem",
                color: "#0B3D91",
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              <Icon name="calendar" size={14} strokeWidth={1.75} />
              {formatRange(ev)}
              {ev.end_time && ` (${formatEventTime(ev.end_time)})`}
              {ongoing && (
                <span
                  style={{
                    background: "#16a34a",
                    color: "white",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="px-2 py-0.5 rounded-full"
                >
                  {t("extra.agenda.enCours").toUpperCase()}
                </span>
              )}
            </div>
          )}
          {ev.location && (
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.74rem",
                color: "#9ca3af",
                marginTop: 2,
              }}
              className="flex items-center gap-1"
            >
              <Icon name="mapPin" size={14} strokeWidth={1.75} /> {ev.location}
            </div>
          )}
          {ev.description && (
            <div
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.78rem",
                color: "#4b5563",
                marginTop: 6,
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              {ev.description}
            </div>
          )}
        </div>
        {ev.category && (
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.62rem",
              fontWeight: 700,
              background: ev.category.color + "18",
              color: ev.category.color,
              border: `1px solid ${ev.category.color}30`,
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
            className="px-2.5 py-1 rounded-full"
          >
            {ev.category.name.toUpperCase()}
          </span>
        )}
      </div>
    )
  }

  function EventList({ list, isPast }: { list: ParishEvent[]; isPast: boolean }) {
    return (
      <div className="space-y-8">
        {group(list, isPast).map(([date, events]) => (
          <div key={date}>
            <div className="flex items-center gap-4 mb-4">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: isPast ? "#6b7280" : "#0B3D91",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {new Date(date + "T00:00:00").getDate()}
                </span>
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.5rem",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {fmt(date, { month: "short" })}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1c2340",
                  textTransform: "capitalize",
                }}
              >
                {formatDate(date)}
              </h3>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>
            <div className="ml-0 sm:ml-14 space-y-3">
              {events.map((ev) => (
                <EventRow key={ev.id} ev={ev} isPast={isPast} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function SectionTitle({ icon, label, count }: { icon: "calendar" | "clock"; label: string; count: number }) {
    return (
      <div className="flex items-center gap-3 mb-6">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#0B3D9112",
            color: "#0B3D91",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={18} strokeWidth={1.75} />
        </div>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#1c2340",
          }}
        >
          {label}
        </h2>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#6b7280",
            background: "#f3f4f6",
          }}
          className="px-2.5 py-1 rounded-full"
        >
          {count}
        </span>
      </div>
    )
  }

  function Empty({ text }: { text: string }) {
    return (
      <div className="text-center py-10">
        <div className="mb-3">
          <Icon name="calendar" size={36} style={{ color: "#9ca3af" }} />
        </div>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.88rem",
            color: "#6b7280",
          }}
        >
          {text}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img
          src={banner}
          alt={t("top.agenda.alt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("top.common.accueil")}
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
              {t("top.agenda.breadcrumb")}
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
            {t("top.agenda.titre")}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("top.agenda.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-12 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          {/* Category filters (apply to both sections) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCat(cat.value)}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  background:
                    activeCat === cat.value
                      ? colorOf(cat.value) || "#0B3D91"
                      : "white",
                  color: activeCat === cat.value ? "white" : "#374151",
                  border: `1px solid ${
                    activeCat === cat.value
                      ? colorOf(cat.value) || "#0B3D91"
                      : "#e5e7eb"
                  }`,
                }}
                className="px-4 py-2 rounded-full hover:opacity-90 transition-all whitespace-nowrap"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p
              style={{ fontFamily: "Montserrat, sans-serif", color: "#6b7280" }}
              className="text-center py-10"
            >
              {t("top.common.chargement")}
            </p>
          ) : (
            <>
              {/* Upcoming events block */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 mb-8">
                <SectionTitle
                  icon="calendar"
                  label={t("top.agenda.aVenir")}
                  count={upcomingFiltered.length}
                />
                {upcomingFiltered.length ? (
                  <EventList list={upcomingFiltered} isPast={false} />
                ) : (
                  <Empty text={t("top.agenda.aucunAVenir")} />
                )}
              </div>

              {/* Past events block */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8">
                <SectionTitle
                  icon="clock"
                  label={t("top.agenda.passes")}
                  count={pastFiltered.length}
                />
                {pastFiltered.length ? (
                  <>
                    <EventList
                      list={pastFiltered.slice(0, pastShown)}
                      isPast
                    />
                    {pastFiltered.length > pastShown && (
                      <div className="text-center mt-8">
                        <button
                          onClick={() => setPastShown((n) => n + PAST_PAGE)}
                          style={{
                            border: "2px solid #0B3D91",
                            color: "#0B3D91",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                          className="px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
                        >
                          {t("extra.agenda.voirPlus")}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Empty text={t("extra.agenda.aucunPasse")} />
                )}
              </div>
            </>
          )}

          <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center">
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1c2340",
                marginBottom: 8,
              }}
            >
              {t("top.agenda.ctaTitre")}
            </h3>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.85rem",
                color: "#6b7280",
                marginBottom: 16,
                lineHeight: 1.7,
              }}
            >
              {t("top.agenda.ctaTexte")}
            </p>
            <Link
              to="/contact"
              style={{
                background: "#0B3D91",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.83rem",
              }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {t("top.agenda.ctaBouton")}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
