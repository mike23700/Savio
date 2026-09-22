import { useState, useEffect } from "react";
import { Link } from "react-router";
import { NEWS } from "@/data/content";
import { apiGet } from "@/lib/api";

interface NextMass {
  date: string;
  time: string;
  type: string;
  note: string | null;
  day_label: string;
}

interface TodayItem {
  time: string;
  type: string;
}

interface LatestHomelie {
  title: string;
  sunday: string;
  readings: string;
  published_at: string;
}

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 inline ml-1">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Service Icons (light, 1.5 stroke) ───────────────────────────────────────
const SvgChurch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 21h18M3 10h18M5 21V10M19 21V10M12 3L3 10h18L12 3z" /><path d="M12 3V1M10 6h4" />
  </svg>
);
const SvgCross = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
    <line x1="12" y1="2" x2="12" y2="22" /><line x1="4" y1="9" x2="20" y2="9" />
  </svg>
);
const SvgBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" />
    <path d="M12 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" />
  </svg>
);
const SvgHands = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M18 11V7a2 2 0 0 0-4 0v4M14 11V5a2 2 0 0 0-4 0v6M10 11V7a2 2 0 0 0-4 0v4" />
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L8 17V7" />
  </svg>
);
const SvgMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
  </svg>
);
const SvgCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const SvgPeople = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const SvgHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const SvgBag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const SvgHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1637615739656-ca10c4285c88?w=1600&h=700&fit=crop&auto=format",
    tag: "CONCERTS",
    date: "28 septembre 2026",
    title: "Grand concert des chorales paroissiales",
    desc: "Nos chorales Hosanna, Magnificat et Saint Cécile vous invitent à un soir de louange et de prière.",
    cta: "Voir le programme",
    to: "/agenda",
  },
  {
    img: "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=1600&h=700&fit=crop&auto=format",
    tag: "RETRAITE",
    date: "15–17 octobre 2026",
    title: "Retraite de préparation à l'Avent",
    desc: "Trois jours de ressourcement spirituel, de méditation et de confession pour toute la communauté.",
    cta: "S'inscrire",
    to: "/agenda",
  },
  {
    img: "https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=1600&h=700&fit=crop&auto=format",
    tag: "FAMILLE",
    date: "5 octobre 2026",
    title: "Journée des familles de la paroisse",
    desc: "Un après-midi de partage, de jeux et de convivialité pour toutes les familles paroissiales.",
    cta: "En savoir plus",
    to: "/actualites",
  },
  {
    img: "https://images.unsplash.com/photo-1785355805907-b95663dfb621?w=1600&h=700&fit=crop&auto=format",
    tag: "SOLIDARITÉ",
    date: "Novembre 2026",
    title: "Campagne Caritas : rentrée scolaire solidaire",
    desc: "Ensemble, aidons les enfants les plus vulnérables de notre quartier à accéder à l'éducation.",
    cta: "Faire un don",
    to: "/don",
  },
];

const SERVICES = [
  { Icon: SvgChurch, label: "Messes", sub: "Horaires et intentions", to: "/celebrer/messes" },
  { Icon: SvgCross, label: "Sacrements", sub: "Baptême, mariage…", to: "/celebrer/sacrements" },
  { Icon: SvgBook, label: "Catéchèse", sub: "Enfants, jeunes, adultes", to: "/se-nourrir/catechese" },
  { Icon: SvgHands, label: "Prière", sub: "Méditations et prières", to: "/se-nourrir/priere" },
  { Icon: SvgMic, label: "Homélies", sub: "Écouter et télécharger", to: "/homelies" },
  { Icon: SvgCalendar, label: "Agenda", sub: "Événements paroissiaux", to: "/agenda" },
  { Icon: SvgPeople, label: "Mouvements", sub: "Conseils et groupes", to: "/vie-paroissiale/mouvements" },
  { Icon: SvgHeart, label: "Caritas", sub: "Solidarité et entraide", to: "/vie-paroissiale/caritas" },
  { Icon: SvgBag, label: "Boutique", sub: "Livres et objets religieux", to: "/boutique" },
  { Icon: SvgHome, label: "Espace paroissial", sub: "Mon espace personnel", to: "/espace-paroissien" },
];

// ─── Slideshow ────────────────────────────────────────────────────────────────

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 580 }}>
      {SLIDES.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" style={{ minHeight: 580 }} />
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
            📅 {slide.date}
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
              {slide.cta} <IconArrow />
            </Link>
            <Link to="/paroisse"
              style={{ border: "2px solid rgba(255,255,255,0.65)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem", color: "white" }}
              className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-white hover:text-blue-900 transition-all">
              Découvrir la paroisse
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
        ‹
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all">
        ›
      </button>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [nextMass, setNextMass] = useState<NextMass | null>(null);
  const [todayItems, setTodayItems] = useState<TodayItem[]>([]);
  const [latestHomelie, setLatestHomelie] = useState<LatestHomelie | null>(null);

  useEffect(() => {
    apiGet<NextMass | null>("/mass-schedule/next").then(setNextMass).catch(() => {});
    apiGet<TodayItem[]>("/mass-schedule/today").then(setTodayItems).catch(() => {});
    apiGet<LatestHomelie | null>("/homelies/latest").then(setLatestHomelie).catch(() => {});
  }, []);

  const nextMassLabel = nextMass
    ? `${nextMass.date === new Date().toISOString().slice(0, 10) ? "Aujourd'hui" : nextMass.day_label} – ${nextMass.time}`
    : null;

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
                <span className="text-lg">⛪</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>PROCHAINE MESSE</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", fontWeight: 700, color: "#0B3D91" }}>{nextMassLabel || "—"}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", marginTop: 4 }}>{nextMass?.type} {nextMass?.note ? `· ${nextMass.note}` : ""}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#9ca3af", marginTop: 6, lineHeight: 1.5 }}>
                📍 New-Bell Bonadoumbé, Douala
              </div>
              <div className="mt-auto pt-4">
                <Link to="/celebrer/messes" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">Voir le calendrier <IconArrow /></Link>
              </div>
            </div>

            {/* Lectures du jour */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📖</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>LECTURES DU JOUR</span>
              </div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.3 }}>
                {latestHomelie ? new Date(latestHomelie.published_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"}
              </div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#4b5563", marginTop: 4 }}>{latestHomelie?.sunday}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#9ca3af", marginTop: 6, lineHeight: 1.6 }}>
                {latestHomelie?.readings}
              </div>
              <div className="mt-auto pt-4">
                <Link to="/celebrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">Lire les lectures <IconArrow /></Link>
              </div>
            </div>

            {/* Aujourd'hui */}
            <div className="p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📅</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.12em" }}>AUJOURD'HUI</span>
              </div>
              <div className="space-y-2 flex-1">
                {todayItems.slice(0, 4).map(({ time, type }, i) => (
                  <div key={`${time}-${i}`} className="flex items-center gap-3">
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#0B3D91", minWidth: 44 }}>{time}</span>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#4b5563" }}>{type}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <Link to="/agenda" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 600 }}
                  className="flex items-center gap-1 hover:underline">Voir tout l'agenda <IconArrow /></Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">NOS SERVICES</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340" }}>
              Nos services aux fidèles
            </h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280", marginTop: 6 }}>
              Des outils pour grandir dans la foi et vivre pleinement la vie paroissiale
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SERVICES.map(({ Icon, label, sub, to }) => {
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
                      <Icon />
                    </div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700, color: isHov ? "white" : "#1c2340", lineHeight: 1.3, transition: "color 0.2s" }}>{label}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.64rem", color: isHov ? "rgba(255,255,255,0.72)" : "#9ca3af", marginTop: 2, lineHeight: 1.4, transition: "color 0.2s" }}>{sub}</div>
                  </Link>
                );
              })}
            </div>
            <div className="relative rounded-2xl overflow-hidden min-h-[280px]">
              <img src="https://images.unsplash.com/photo-1516013474378-d6498f0d1434?w=600&h=500&fit=crop&auto=format"
                alt="Communauté en prière" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontStyle: "italic", color: "white", lineHeight: 1.5 }}>
                  « Que votre lumière brille devant les hommes. »
                </blockquote>
                <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#D4AF37", marginTop: 8, display: "block", fontStyle: "normal", fontWeight: 600 }}>
                  Matthieu 5,16
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
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.15em" }} className="mb-2">ACTUALITÉS</div>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#1c2340" }}>
                Actualités & Annonces
              </h2>
            </div>
            <Link to="/actualites" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#0B3D91", fontWeight: 600 }}
              className="hidden sm:flex items-center gap-1 hover:underline whitespace-nowrap">
              Voir toutes les annonces <IconArrow />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NEWS.slice(0, 4).map((n) => (
              <Link to={`/actualites/${n.id}`} key={n.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="relative h-44 overflow-hidden">
                  <img src={n.img} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700, background: n.tagColor, color: "white", letterSpacing: "0.08em" }}
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full">{n.tag.toUpperCase()}</span>
                </div>
                <div className="p-4">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "#9ca3af", marginBottom: 6 }}>{n.date}</div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.92rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.45 }}>{n.title}</h3>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "#0B3D91", fontWeight: 600 }}
                    className="flex items-center gap-1 mt-3">Lire la suite <IconArrow /></span>
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
              ÉVANGILE DU JOUR
            </div>
            <blockquote style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontStyle: "italic", color: "white", lineHeight: 1.6 }}>
              « Là où est ton trésor, là aussi sera ton cœur. »
            </blockquote>
            <cite style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: 6, display: "block", fontStyle: "normal" }}>
              Matthieu 6, 21
            </cite>
          </div>
          <Link to="/se-nourrir/priere"
            style={{ border: "2px solid #D4AF37", color: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.83rem" }}
            className="shrink-0 px-6 py-3 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all whitespace-nowrap">
            Lire la méditation du jour <IconArrow />
          </Link>
        </div>
      </section>

      {/* Quick actions */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "⛪", title: "Demander une messe", desc: "Pour un défunt, un malade, une action de grâce...", cta: "Faire une intention", bg: "#0B3D91", to: "/celebrer/intention" },
            { icon: "❤️", title: "Faire un don", desc: "Votre soutien fait vivre la paroisse", cta: "Soutenir la paroisse", bg: "#D4AF37", to: "/don" },
            { icon: "👥", title: "Rejoindre la communauté", desc: "Devenez paroissien et engagez-vous", cta: "Je m'inscris", bg: "#0B3D91", to: "/contact" },
            { img: "https://images.unsplash.com/photo-1634334639396-b34c80a75ea1?w=400&h=300&fit=crop&auto=format", title: "La vie de Saint Dominique Savio", desc: "Un modèle de foi pour les jeunes du monde entier", cta: "Découvrir", bg: "#1c2340", to: "/paroisse/savio" },
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
                {a.icon && <div className="text-3xl mb-3">{a.icon}</div>}
                <div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "white", lineHeight: 1.3 }}>{a.title}</h3>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.74rem", color: "rgba(255,255,255,0.72)", marginTop: 6, lineHeight: 1.55 }}>{a.desc}</p>
                </div>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 600, color: "#D4AF37" }}
                  className="flex items-center gap-1 mt-4">{a.cta} <IconArrow /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
