import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { PARISH } from "@/data/content";
import logoImg from "@/imports/logo.png";
import { useSettings } from "@/lib/settings";
import { useLang } from "@/lib/i18n";
import Icon, { type IconName } from "@/components/Icon";
import LangSwitch from "@/components/LangSwitch";

/** Accessible names for the social round buttons, which now hold a bare icon. */
const SOCIAL_LABELS: Partial<Record<IconName, string>> = {
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
};


const NAV = [
  { labelKey: "nav.accueil", to: "/" },
  {
    labelKey: "nav.paroisse", to: "/paroisse",
    sub: [
      { labelKey: "nav.paroisse.histoire", to: "/paroisse/histoire" },
      { labelKey: "nav.paroisse.genese", to: "/paroisse/genese" },
      { labelKey: "nav.paroisse.savio", to: "/paroisse/savio" },
      { labelKey: "nav.paroisse.equipe", to: "/paroisse/equipe" },
      { labelKey: "nav.paroisse.organisation", to: "/paroisse/organisation" },
      { labelKey: "nav.paroisse.archidiocese", to: "/paroisse/archidiocese" },
      { labelKey: "nav.paroisse.mediatheque", to: "/paroisse/mediatheque" },
    ],
  },
  {
    labelKey: "nav.vie", to: "/vie-paroissiale",
    sub: [
      { labelKey: "nav.vie.mouvements", to: "/vie-paroissiale/mouvements" },
      { labelKey: "nav.vie.caritas", to: "/vie-paroissiale/caritas" },
      { labelKey: "nav.vie.projets", to: "/vie-paroissiale/projets" },
      { labelKey: "nav.vie.registre", to: "/vie-paroissiale/registre" },
    ],
  },
  {
    labelKey: "nav.celebrer", to: "/celebrer",
    sub: [
      { labelKey: "nav.celebrer.messes", to: "/celebrer/messes" },
      { labelKey: "nav.celebrer.sacrements", to: "/celebrer/sacrements" },
      { labelKey: "nav.celebrer.intention", to: "/celebrer/intention" },
      { labelKey: "nav.celebrer.bans", to: "/celebrer/bans" },
      { labelKey: "nav.celebrer.homelies", to: "/homelies" },
      { labelKey: "nav.celebrer.agenda", to: "/agenda" },
    ],
  },
  {
    labelKey: "nav.nourrir", to: "/se-nourrir",
    sub: [
      { labelKey: "nav.nourrir.lectures", to: "/lectures" },
      { labelKey: "nav.nourrir.catechese", to: "/se-nourrir/catechese" },
      { labelKey: "nav.nourrir.priere", to: "/se-nourrir/priere" },
      { labelKey: "nav.nourrir.journal", to: "/se-nourrir/journal" },
    ],
  },
  {
    labelKey: "nav.louer", to: "/centre-accueil",
    sub: [
      { labelKey: "nav.louer.chambre", to: "/centre-accueil" },
      { labelKey: "nav.louer.salle", to: "/location-salles" },
    ],
  },
  { labelKey: "nav.actualites", to: "/actualites" },
  { labelKey: "nav.agenda", to: "/agenda" },
  { labelKey: "nav.boutique", to: "/boutique" },
];

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  const settings = useSettings();
  const { t } = useLang();
  return (
    <div className="hidden sm:block" style={{ background: "#0B3D91" }}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
          {settings["parish.tagline"] || PARISH.tagline}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/espace-paroissien"
            style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap">
            <Icon name="user" size={15} strokeWidth={1.75} /> {t("topbar.espace")}
          </Link>
          <Link to="/don"
            style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 700 }}
            className="flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
            <Icon name="heart" size={15} strokeWidth={1.75} /> {t("topbar.don")}
          </Link>
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
  const { t } = useLang();

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
            <div key={item.to} className="relative"
              onMouseEnter={() => item.sub && setDropdown(item.labelKey)}
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
                {t(item.labelKey)}
                {item.sub && <Icon name="chevronDown" size={16} strokeWidth={1.75} />}
              </Link>
              {item.sub && dropdown === item.labelKey && (
                <div className="absolute top-full left-0 bg-white rounded-xl py-2 min-w-[200px] z-50 border border-gray-100"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}>
                  {item.sub.map((s) => (
                    <Link key={s.to} to={s.to}
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
                      {t(s.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sélecteur de langue + menu mobile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <LangSwitch />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600 hover:text-blue-800 rounded-lg hover:bg-gray-50">
            {mobileOpen ? <Icon name="close" size={24} strokeWidth={1.75} /> : <Icon name="menu" size={24} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.to}>
              <Link to={item.to}
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: isActive(item.to) ? "#0B3D91" : "#374151" }}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                {t(item.labelKey)}
                {item.sub && <Icon name="chevronDown" size={16} strokeWidth={1.75} />}
              </Link>
              {item.sub && (
                <div style={{ background: "#F5F7FA" }}>
                  {item.sub.map((s) => (
                    <Link key={s.to} to={s.to}
                      style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#6b7280" }}
                      className="block px-8 py-2.5 border-b border-gray-100 hover:text-blue-800">
                      {t(s.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 space-y-2.5">
            <Link to="/don"
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="block text-center text-white px-4 py-3 rounded-full">
              <Icon name="heart" size={15} strokeWidth={1.75} /> {t("topbar.don")}
            </Link>
            <Link to="/espace-paroissien"
              style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="block text-center px-4 py-3 rounded-full">
              <Icon name="user" size={15} strokeWidth={1.75} /> {t("topbar.espace")}
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
  const { t } = useLang();
  const whatsapp = settings["parish.whatsapp_number"] || "237655529999";
  const founded = settings["parish.founded"] || PARISH.founded;
  const presentation = t("footer.presentation").replace("{date}", founded);
  return (
    <footer style={{ background: "#0B3D91" }} className="text-white pt-14 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Paroisse Saint Dominique Savio" style={{ height: 44, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
            {presentation}
          </p>
          <div className="flex items-center gap-2 mt-5">
            {([
              ["whatsapp", `https://wa.me/${whatsapp}`],
              ["facebook", settings["social.facebook_url"] || "#"],
              ["youtube", settings["social.youtube_url"] || "#"],
              ["instagram", settings["social.instagram_url"] || "#"],
            ] as [IconName, string][]).map(([icon, href], i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" title={SOCIAL_LABELS[icon]}
                style={{ width: 34, height: 34, background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                className="hover:bg-yellow-400 transition-colors">
                <Icon name={icon} size={17} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            {t("footer.liensUtiles")}
          </div>
          {[["footer.paroisse", "/paroisse"], ["footer.vie", "/vie-paroissiale"], ["footer.celebrer", "/celebrer"], ["footer.sacrements", "/celebrer#sacrements"], ["footer.homelies", "/homelies"], ["footer.agenda", "/agenda"]].map(([k, to]) => (
            <Link key={k} to={to} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}
              className="block mb-2.5 hover:text-yellow-300 transition-colors">{t(k)}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            {t("footer.ressources")}
          </div>
          {[["footer.mediatheque", "/mediatheque"], ["footer.actualites", "/actualites"], ["footer.catechese", "/se-nourrir#catechese"], ["footer.boutique", "/mediatheque#boutique"], ["footer.contact", "/contact"]].map(([k, to]) => (
            <Link key={k} to={to} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}
              className="block mb-2.5 hover:text-yellow-300 transition-colors">{t(k)}</Link>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#D4AF37", letterSpacing: "0.12em" }} className="mb-5">
            {t("footer.contacter")}
          </div>
          <div className="space-y-3">
            {([
              ["mapPin", PARISH.address],
              ["phone", PARISH.phone],
              ["mail", PARISH.email],
              ["clock", PARISH.hours],
            ] as [IconName, string][]).map(([icon, text]) => (
              <div key={text} className="flex gap-2.5">
                <Icon name={icon} size={16} strokeWidth={1.75} className="mt-0.5 text-white/70" />
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
          <Link to="/don"
            style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}
            className="block text-center text-white px-4 py-2.5 rounded-full mt-5 hover:opacity-90 transition-opacity">
            <Icon name="heart" size={15} strokeWidth={1.75} /> {t("footer.don")}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
          {t("footer.droits")}
        </p>
        <div className="flex gap-5">
          {["footer.mentions", "footer.confidentialite"].map((k) => (
            <Link key={k} to="/contact" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}
              className="hover:text-white transition-colors">{t(k)}</Link>
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
