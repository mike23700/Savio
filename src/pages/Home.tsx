import { useState, useEffect } from "react";
import { Link } from "react-router";
import { apiGet, clientTimeQuery, localDateISO, mediaUrl } from "\@/lib/api";
import Icon, { type IconName } from "@/components/Icon";
import { formatNewsDate, readingsList, type DailyReadings, type NewsArticle } from "@/lib/content-types";
import { useLang } from "@/lib/i18n";

interface MassOccurrence {
  date: string;
  time: string;
  type: string;
  note: string | null;
  day_label: string;
}

/** "Aujourd'hui – 18h30", "Demain – 06h30" or "Dimanche 27 septembre – 09h00". */
function massLabel(m: MassOccurrence, today: string, t: (key: string) => string, locale: string): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let day: string;
  if (m.date === today) day = t("home.messe.aujourdhui");
  else if (m.date === localDateISO(tomorrow)) day = t("home.messe.demain");
  else {
    day = new Date(`${m.date}T12:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
    day = day.charAt(0).toUpperCase() + day.slice(1);
  }
  return `${day} – ${m.time}`;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1637615739656-ca10c4285c88?w=1600&h=700&fit=crop&auto=format",
    to: "/agenda",
  },
  {
    img: "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=1600&h=700&fit=crop&auto=format",
    to: "/agenda",
  },
  {
    img: "https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1600&h=700&fit=crop&auto=format",
    to: "/actualites",
  },
  {
    img: "https://images.unsplash.com/photo-1785355805907-b95663dfb621?w=1600&h=700&fit=crop&auto=format",
    to: "/don",
  },
];

// ─── Slideshow ────────────────────────────────────────────────────────────────

function HeroSlideshow() {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = {
    ...SLIDES[current],
    tag: t(`home.slide.${current + 1}.tag`),
    date: t(`home.slide.${current + 1}.date`),
    title: t(`home.slide.${current + 1}.title`),
    desc: t(`home.slide.${current + 1}.desc`),
    cta: t(`home.slide.${current + 1}.cta`),
  };

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 580 }}>
      {SLIDES.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={s.img} alt={t(`home.slide.${i + 1}.title`)} className="w-full h-full object-cover" style={{ minHeight: 580 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.60) 55%, rgba(8,45,107,0.20) 100%)" }} />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col justify-center" style={{ minHeight: 580 }}>
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 mb-5">
            <div style={{ width: 28, height: 2, background: "#D4AF37" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.68rem", color: "#D4AF37", letterSpacing: "0.18em" }}>
              {slide.tag}
            </span>
          </div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", marginBottom: 12 }}>
            <Icon name="calendar" size={15} /> {slide.date}
          </div>
          <h1 key={current} style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 700, lineHeight: 1.12 }}>
            {slide.title}
          </h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.82)", fontSize: "0.95rem", lineHeight: 1.75, marginTop: "1rem", maxWidth: 440 }}>
            {slide.desc}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to={slide.to}
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              {slide.cta} <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/paroisse"
              style={{ border: "2px solid rgba(255,255,255,0.65)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem", color: "white" }}
              className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white hover:text-blue-900 transition-all">
              {t("home.hero.decouvrir")}
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 28 : 8, height: 8, borderRadius: 4,
              background: i === current ? "#D4AF37" : "rgba(255,255,255,0.45)",
              border: "none", cursor: "pointer", transition: "all 0.3s",
            }} />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
        <Icon name="chevronLeft" size={20} strokeWidth={1.75} />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
        <Icon name="chevronRight" size={20} strokeWidth={1.75} />
      </button>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const { t, lang } = useLang();
  const locale = lang === "en" ? "en-GB" : "fr-FR";
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [nextMass, setNextMass] = useState<MassOccurrence | null>(null);
  const [todayItems, setTodayItems] = useState<MassOccurrence[]>([]);
  const [readings, setReadings] = useState<DailyReadings | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  // Local date of the visitor's computer; re-evaluated every minute so the
  // cards roll over at midnight without reloading the page.
  const [today, setToday] = useState(localDateISO());

  useEffect(() => {
    apiGet<NewsArticle[]>("/news?limit=4").then(setNews).catch(() => {});
  }, []);

  // Next mass + the next 4 masses of today, computed from the device clock
  // and refreshed every minute so past masses drop off the list.
  useEffect(() => {
    function refresh() {
      setToday(localDateISO());
      apiGet<MassOccurrence | null>(`/mass-schedule/next${clientTimeQuery()}`).then(setNextMass).catch(() => {});
      apiGet<MassOccurrence[]>(`/mass-schedule/today${clientTimeQuery({ upcoming: true, masses: true, limit: 4 })}`)
        .then(setTodayItems)
        .catch(() => {});
    }
    refresh();
    const timer = setInterval(refresh, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setReadings(null);
    apiGet<DailyReadings | null>(`/lectures/jour?date=${today}`).then(setReadings).catch(() => {});
  }, [today]);

  const todayLong = new Date(`${today}T12:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const todayShort = new Date(`${today}T12:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const readingRefs = readingsList(readings);

  const SERVICES: { icon: IconName; label: string; sub: string; to: string }[] = [
    { icon: "church", label: t("home.services.1.label"), sub: t("home.services.1.sub"), to: "/celebrer/messes" },
    { icon: "cross", label: t("home.services.2.label"), sub: t("home.services.2.sub"), to: "/celebrer/sacrements" },
    { icon: "bookOpen", label: t("home.services.3.label"), sub: t("home.services.3.sub"), to: "/se-nourrir/catechese" },
    { icon: "pray", label: t("home.services.4.label"), sub: t("home.services.4.sub"), to: "/se-nourrir/priere" },
    { icon: "mic", label: t("home.services.5.label"), sub: t("home.services.5.sub"), to: "/homelies" },
    { icon: "calendar", label: t("home.services.6.label"), sub: t("home.services.6.sub"), to: "/agenda" },
    { icon: "users", label: t("home.services.7.label"), sub: t("home.services.7.sub"), to: "/vie-paroissiale/mouvements" },
    { icon: "heart", label: t("home.services.8.label"), sub: t("home.services.8.sub"), to: "/vie-paroissiale/caritas" },
    { icon: "bag", label: t("home.services.9.label"), sub: t("home.services.9.sub"), to: "/boutique" },
    { icon: "home", label: t("home.services.10.label"), sub: t("home.services.10.sub"), to: "/espace-paroissien" },
  ];

  return (
    <>
      <HeroSlideshow />

      {/* Info strip */}
      <section style={{ background: "#F5F7FA" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white shadow-sm">

            {/* Prochaine messe */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="church" size={20} style={{ color: "#0B3D91" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>{t("home.bandeau.prochaineMesse")}</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", fontWeight: 700, color: "#0B3D91" }}>{nextMass ? massLabel(nextMass, today, t, locale) : "—"}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", marginTop: 4 }}>{nextMass?.type} {nextMass?.note ? `· ${nextMass.note}` : ""}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#9ca3af", marginTop: 6, lineHeight: 1.5 }}>
                <Icon name="mapPin" size={15} /> {t("home.bandeau.adresse")}
              </div>
              <div className="mt-auto pt-4">
                <Link to="/celebrer/messes" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">{t("home.bandeau.voirCalendrier")} <Icon name="arrowRight" size={16} /></Link>
              </div>
            </div>

            {/* Lectures du jour */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="bookOpen" size={20} style={{ color: "#0B3D91" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>{t("home.bandeau.lecturesDuJour")}</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.3, textTransform: "capitalize" }}>
                {todayLong}
              </div>
              {readings?.liturgical_day && (
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", marginTop: 4 }}>{readings.liturgical_day}</div>
              )}
              {readingRefs.length > 0 ? (
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#6b7280", marginTop: 6, lineHeight: 1.6 }}>
                  {readingRefs.map((r) => (
                    <div key={r.label}><span style={{ fontWeight: 600, color: "#0B3D91" }}>{r.label} :</span> {r.value}</div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#9ca3af", marginTop: 6 }}>
                  {readings === null ? t("home.lectures.chargement") : t("home.lectures.indisponibles")}
                </div>
              )}
              <div className="mt-auto pt-4">
                <Link to="/lectures" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">{t("home.bandeau.lireLesLectures")} <Icon name="arrowRight" size={16} /></Link>
              </div>
            </div>

            {/* Aujourd'hui */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="calendar" size={20} style={{ color: "#0B3D91" }} />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>{t("home.bandeau.aujourdhui")}</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 600, color: "#1c2340", marginBottom: 10, textTransform: "capitalize" }}>
                {todayShort}
              </div>
              <div className="space-y-2 flex-1">
                {todayItems.length === 0 ? (
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>
                    {t("home.bandeau.plusDeMesse")}
                    {nextMass && <> {t("home.bandeau.prochaine")} <strong style={{ color: "#0B3D91" }}>{massLabel(nextMass, today, t, locale)}</strong></>}
                  </div>
                ) : (
                  todayItems.map(({ time, type }, i) => (
                    <div key={`${time}-${i}`} className="flex items-center gap-3">
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91", minWidth: 44 }}>{time}</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#4b5563" }}>{type}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-auto pt-4">
                <Link to="/celebrer/messes" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">{t("home.bandeau.tousLesHoraires")} <Icon name="arrowRight" size={16} /></Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("home.services.surtitre")}</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340" }}>
              {t("home.services.titre")}
            </h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 6 }}>
              {t("home.services.sousTitre")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SERVICES.map(({ icon, label, sub, to }) => {
                const isHov = hoveredService === label;
                return (
                  <Link to={to} key={label}
                    className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200"
                    style={{
                      background: isHov ? "#0B3D91" : "#F5F7FA",
                      border: `1px solid ${isHov ? "#0B3D91" : "transparent"}`,
                    }}
                    onMouseEnter={() => setHoveredService(label)}
                    onMouseLeave={() => setHoveredService(null)}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: isHov ? "rgba(255,255,255,0.18)" : "#E8F2FF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 8, color: isHov ? "white" : "#0B3D91",
                      transition: "all 0.2s",
                    }}>
                      <Icon name={icon} size={24} />
                    </div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700, color: isHov ? "white" : "#1c2340", lineHeight: 1.3, transition: "color 0.2s" }}>{label}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.64rem", color: isHov ? "rgba(255,255,255,0.72)" : "#9ca3af", marginTop: 2, lineHeight: 1.4, transition: "color 0.2s" }}>{sub}</div>
                  </Link>
                );
              })}
            </div>
            <div className="relative rounded-2xl overflow-hidden min-h-[280px]">
              <img src="https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=600&h=500&fit=crop&auto=format"
                alt={t("home.services.altImage")} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontStyle: "italic", color: "white", lineHeight: 1.5 }}>
                  {t("home.citation.lumiere")}
                </blockquote>
                <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#D4AF37", marginTop: 8, display: "block", fontStyle: "normal", fontWeight: 600 }}>
                  {t("home.citation.lumiereRef")}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 px-4" style={{ background: "#F5F7FA" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">{t("home.actualites.surtitre")}</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340" }}>
                {t("home.actualites.titre")}
              </h2>
            </div>
            <Link to="/actualites" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#0B3D91", fontWeight: 600 }}
              className="hidden sm:flex items-center gap-1 hover:underline whitespace-nowrap">
              {t("home.actualites.voirToutes")} <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {news.map((n) => (
              <Link to={`/actualites/${n.id}`} key={n.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="relative h-44 overflow-hidden">
                  {n.img && <img src={mediaUrl(n.img) ?? undefined} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {n.category && (
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700, background: n.category.color, color: "white", letterSpacing: "0.08em" }}
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full">{n.category.name.toUpperCase()}</span>
                  )}
                </div>
                <div className="p-4">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "#9ca3af", marginBottom: 6 }}>{formatNewsDate(n.published_at)}</div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.92rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.45 }}>{n.title}</h3>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "#0B3D91", fontWeight: 600 }}
                    className="flex items-center gap-1 mt-3">{t("home.actualites.lireLaSuite")} <Icon name="arrowRight" size={16} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gospel banner */}
      <section style={{ background: "#0B3D91" }} className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.18em" }} className="mb-3">
              {t("home.evangile.surtitre")}
            </div>
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontStyle: "italic", color: "white", lineHeight: 1.6 }}>
              {t("home.evangile.texte")}
            </blockquote>
            <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: 6, display: "block", fontStyle: "normal" }}>
              {t("home.evangile.reference")}
            </cite>
          </div>
          <Link to="/se-nourrir/priere"
            style={{ border: "2px solid #D4AF37", color: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem" }}
            className="shrink-0 px-6 py-3 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all whitespace-nowrap">
            {t("home.evangile.lireMeditation")} <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "church", title: t("home.action.1.title"), desc: t("home.action.1.desc"), cta: t("home.action.1.cta"), bg: "#0B3D91", to: "/celebrer/intention" },
            { icon: "heart", title: t("home.action.2.title"), desc: t("home.action.2.desc"), cta: t("home.action.2.cta"), bg: "#D4AF37", to: "/don" },
            { icon: "users", title: t("home.action.3.title"), desc: t("home.action.3.desc"), cta: t("home.action.3.cta"), bg: "#0B3D91", to: "/contact" },
            { img: "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=400&h=300&fit=crop&auto=format", title: t("home.action.4.title"), desc: t("home.action.4.desc"), cta: t("home.action.4.cta"), bg: "#1c2340", to: "/paroisse/savio" },
          ].map((a) => (
            <Link to={a.to} key={a.title} className="relative rounded-2xl overflow-hidden min-h-[200px] group">
              {a.img && (
                <>
                  <img src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "rgba(28,35,64,0.78)" }} />
                </>
              )}
              {!a.img && <div className="absolute inset-0" style={{ background: a.bg }} />}
              <div className="relative p-6 flex flex-col justify-between h-full min-h-[200px]">
                {a.icon && <div className="mb-3"><Icon name={a.icon as IconName} size={30} style={{ color: "white" }} /></div>}
                <div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "white", lineHeight: 1.3 }}>{a.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "rgba(255,255,255,0.72)", marginTop: 6, lineHeight: 1.55 }}>{a.desc}</p>
                </div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 600, color: "#D4AF37" }}
                  className="flex items-center gap-1 mt-4">{a.cta} <Icon name="arrowRight" size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
