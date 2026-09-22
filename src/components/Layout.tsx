import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { PARISH } from "@/data/content";
import logoImg from "@/imports/logo.png";
import { useSettings } from "@/lib/settings";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 inline ml-1">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Nav Config ──────────────────────────────────────────────────────────────

const NAV = [
  { label: "Accueil", to: "/" },
  {
    label: "La Paroisse", to: "/paroisse",
    sub: [
      { label: "Notre Histoire", to: "/paroisse/histoire" },
      { label: "Genèse", to: "/paroisse/genese" },
      { label: "Saint Dominique Savio", to: "/paroisse/savio" },
      { label: "Le Curé & l'équipe", to: "/paroisse/equipe" },
      { label: "Organisation", to: "/paroisse/organisation" },
      { label: "Archidiocèse", to: "/paroisse/archidiocese" },
      { label: "Médiathèque", to: "/paroisse/mediatheque" },
    ],
  },
  {
    label: "Vie paroissiale", to: "/vie-paroissiale",
    sub: [
      { label: "Mouvements & Groupes", to: "/vie-paroissiale/mouvements" },
      { label: "Caritas", to: "/vie-paroissiale/caritas" },
      { label: "Projets", to: "/vie-paroissiale/projets" },
      { label: "Registre paroissial", to: "/vie-paroissiale/registre" },
    ],
  },
  {
    label: "Célébrer", to: "/celebrer",
    sub: [
      { label: "Horaires des messes", to: "/celebrer/messes" },
      { label: "Sacrements", to: "/celebrer/sacrements" },
      { label: "Intention de messe", to: "/celebrer/intention" },
      { label: "Publication des bans", to: "/celebrer/bans" },
      { label: "Homélies", to: "/homelies" },
      { label: "Agenda liturgique", to: "/agenda" },
    ],
  },
  {
    label: "Se nourrir", to: "/se-nourrir",
    sub: [
      { label: "Catéchèse", to: "/se-nourrir/catechese" },
      { label: "Prière & Méditation", to: "/se-nourrir/priere" },
      { label: "Journal paroissial", to: "/se-nourrir/journal" },
    ],
  },
  { label: "Actualités", to: "/actualites" },
  { label: "Agenda", to: "/agenda" },
  { label: "Boutique", to: "/boutique" },
];

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  const settings = useSettings();
  const whatsapp = settings["parish.whatsapp_number"] || "237655529999";
  return (
    <div className="hidden sm:block" style={{ background: "#0B3D91" }}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
          {settings["parish.tagline"] || PARISH.tagline}
        </span>
        <div className="flex items-center gap-4">
          {[
            { icon: "💬", label: "WhatsApp", href: `https://wa.me/${whatsapp}` },
            { icon: "📘", label: "Facebook", href: settings["social.facebook_url"] || "#" },
            { icon: "▶️", label: "YouTube", href: settings["social.youtube_url"] || "#" },
            { icon: "📷", label: "Instagram", href: settings["social.instagram_url"] || "#" },
          ].map(({ icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)" }}
              className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
              <span>{icon}</span> {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <header className="sticky top-0 z-50 bg-white transition-shadow" style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "0 1px 0 #e5e7eb" }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoImg} alt="Paroisse Saint Dominique Savio" style={{ height: 52, width: "auto", objectFit: "contain" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map((item) => (
            <div key={item.label} className="relative"
              onMouseEnter={() => item.sub && setDropdown(item.label)}
              onMouseLeave={() => setDropdown(null)}>
              <Link to={item.to}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  color: isActive(item.to) && item.to !== "/" ? "#0B3D91" : location.pathname === "/" && item.to === "/" ? "#0B3D91" : "#374151",
                  borderBottom: (isActive(item.to) && item.to !== "/") || (location.pathname === "/" && item.to === "/") ? "2px solid #D4AF37" : "2px solid transparent",
                }}
                className="flex items-center gap-1 px-2.5 py-2.5 hover:text-blue-800 transition-colors whitespace-nowrap">
                {item.label}
                {item.sub && <IconChevronDown />}
              </Link>
              {item.sub && dropdown === item.label && (
                <div className="absolute top-full left-0 bg-white rounded-xl py-2 min-w-[200px] z-50 border border-gray-100"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}>
                  {item.sub.map((s) => (
                    <Link key={s.label} to={s.to}
                      onClick={() => {
                        setDropdown(null);
                        if (s.to.includes("#")) {
                          const [path, hash] = s.to.split("#");
                          navigate(path);
                          setTimeout(() => {
                            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#374151" }}
                      className="flex items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-800 transition-colors gap-2">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/don"
            style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}
            className="hidden md:flex items-center gap-1.5 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
            ❤️ Faire un don
          </Link>
          <Link to="/espace-paroissien"
            style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", fontWeight: 700 }}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap">
            👤 Espace paroissien
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600 hover:text-blue-800 rounded-lg hover:bg-gray-50">
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.label}>
              <Link to={item.to}
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: isActive(item.to) ? "#0B3D91" : "#374151" }}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                {item.label}
                {item.sub && <IconChevronDown />}
              </Link>
              {item.sub && (
                <div style={{ background: "#F5F7FA" }}>
                  {item.sub.map((s) => (
                    <Link key={s.label} to={s.to}
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280" }}
                      className="block px-8 py-2.5 border-b border-gray-100 hover:text-blue-800">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4">
            <Link to="/don"
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="block text-center text-white px-4 py-3 rounded-full">
              ❤️ Faire un don
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const settings = useSettings();
  const whatsapp = settings["parish.whatsapp_number"] || "237655529999";
  return (
    <footer style={{ background: "#0B3D91" }} className="text-white pt-14 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Paroisse Saint Dominique Savio" style={{ height: 44, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
            Fondée le {settings["parish.founded"] || PARISH.founded}, notre paroisse est un lieu de rencontre, de prière et de fraternité au cœur de Douala.
          </p>
          <div className="flex items-center gap-2 mt-5">
            {[
              ["💬", `https://wa.me/${whatsapp}`],
              ["📘", settings["social.facebook_url"] || "#"],
              ["▶️", settings["social.youtube_url"] || "#"],
              ["📷", settings["social.instagram_url"] || "#"],
            ].map(([icon, href], i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                style={{ width: 34, height: 34, background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}
                className="hover:bg-yellow-400 transition-colors">
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            LIENS UTILES
          </div>
          {[["La Paroisse", "/paroisse"], ["Vie paroissiale", "/vie-paroissiale"], ["Célébrer", "/celebrer"], ["Sacrements", "/celebrer#sacrements"], ["Homélies", "/homelies"], ["Agenda", "/agenda"]].map(([l, to]) => (
            <Link key={l} to={to} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}
              className="block mb-2.5 hover:text-yellow-300 transition-colors">{l}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            RESSOURCES
          </div>
          {[["Médiathèque", "/mediatheque"], ["Actualités", "/actualites"], ["Catéchèse", "/se-nourrir#catechese"], ["Boutique", "/mediatheque#boutique"], ["Contact", "/contact"]].map(([l, to]) => (
            <Link key={l} to={to} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}
              className="block mb-2.5 hover:text-yellow-300 transition-colors">{l}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            NOUS CONTACTER
          </div>
          <div className="space-y-3">
            {[
              ["📍", PARISH.address],
              ["📞", PARISH.phone],
              ["✉️", PARISH.email],
              ["🕐", PARISH.hours],
            ].map(([icon, text]) => (
              <div key={text} className="flex gap-2.5">
                <span className="shrink-0">{icon}</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
          <Link to="/don"
            style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}
            className="block text-center text-white px-4 py-2.5 rounded-full mt-5 hover:opacity-90 transition-opacity">
            ❤️ Faire un don
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
          © 2026 Paroisse Saint Dominique Savio. Tous droits réservés.
        </p>
        <div className="flex gap-5">
          {["Mentions légales", "Politique de confidentialité"].map((l) => (
            <Link key={l} to="/contact" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}
              className="hover:text-white transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
