import Icon from "@/components/Icon"
import { useEffect, useState } from "react"

import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"

import { useAuth } from "@/lib/auth"

import ConfirmHost from "./ConfirmDialog"

import logoImg from "@/imports/logo.png"

import { ApiError } from "@/lib/api"

type NavLinkItem = { label: string; to: string }

type NavGroup = { label: string; children: NavLinkItem[] }

type NavItem = NavLinkItem | NavGroup

const NAV: NavItem[] = [
  { label: "Tableau de bord", to: "/admin" },

  { label: "Actualités", to: "/admin/actualites" },

  { label: "Agenda", to: "/admin/agenda" },

  { label: "Médiathèque", to: "/admin/mediatheque" },

  { label: "Pages de présentation", to: "/admin/pages" },
  { label: "Bannières, textes & musique", to: "/admin/contenus" },

  { label: "Horaires des messes", to: "/admin/horaires-messes" },

  { label: "Lectures du jour", to: "/admin/lectures" },

  {
    label: "Sacrements",
    children: [
      { label: "Fiches sacrements", to: "/admin/sacrements" },
      { label: "Demandes reçues", to: "/admin/demandes-sacrements" },
    ],
  },

  { label: "Catéchèse", to: "/admin/catechese" },

  { label: "Prière & Méditation", to: "/admin/priere" },

  { label: "Intentions de messe", to: "/admin/intentions" },

  { label: "Messages reçus", to: "/admin/messages" },

  { label: "Bans de mariage", to: "/admin/bans" },

  { label: "Homélies", to: "/admin/homelies" },

  { label: "Curé & équipe pastorale", to: "/admin/equipe" },

  { label: "Mouvements & Groupes", to: "/admin/mouvements" },

  { label: "Projets paroissiaux", to: "/admin/projets" },

  {
    label: "Registre paroissial",

    children: [
      { label: "Inscriptions", to: "/admin/registre" },

      { label: "Demandes d'impression", to: "/admin/registre-demandes" },
    ],
  },

  {
    label: "Boutique",

    children: [
      { label: "Produits", to: "/admin/produits" },

      { label: "Commandes", to: "/admin/commandes" },
    ],
  },

  {
    label: "Accueil & salles",

    children: [
      { label: "Chambres & salles", to: "/admin/hebergement/espaces" },

      { label: "Réservations", to: "/admin/hebergement/reservations" },
    ],
  },

  { label: "Dons", to: "/admin/dons" },

  { label: "Comptabilité", to: "/admin/comptabilite" },

  {
    label: "Journal",

    children: [
      { label: "Abonnements", to: "/admin/journal/abonnements" },

      { label: "Numéros", to: "/admin/journal/numeros" },

      { label: "Tarifs", to: "/admin/journal/tarifs" },
    ],
  },

  { label: "Paramètres", to: "/admin/parametres" },
]

const linkStyle = (isActive: boolean, nested = false): React.CSSProperties => ({
  color: "#fff",

  textDecoration: "none",

  padding: nested ? "8px 12px 8px 28px" : "10px 12px",

  borderRadius: 8,

  fontSize: nested ? "0.85rem" : "0.9rem",

  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",

  opacity: nested && !isActive ? 0.85 : 1,
})

/** Collapsible sidebar section; opens by itself when one of its pages is active. */

function NavSection({ group }: { group: NavGroup }) {
  const { pathname } = useLocation()

  const containsActive = group.children.some((c) => pathname.startsWith(c.to))

  const [open, setOpen] = useState(containsActive)

  useEffect(() => {
    if (containsActive) setOpen(true)
  }, [containsActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          ...linkStyle(false),

          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",

          background:
            containsActive && !open ? "rgba(255,255,255,0.15)" : "transparent",
        }}
      >
        {group.label}
        <Icon
          name="chevronDown"
          size={14}
          strokeWidth={1.75}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
            opacity: 0.8,
          }}
        />
      </button>
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          {group.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              style={({ isActive }) => linkStyle(isActive, true)}
            >
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  async function handleLogout() {
    await logout()

    navigate("/admin/login")
  }

  // Safety net: any admin action whose API call fails without its own error
  // handling (save, delete, status change…) shows the server message here
  // instead of failing silently.
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    function onRejection(e: PromiseRejectionEvent) {
      const err = e.reason
      if (err instanceof ApiError) {
        e.preventDefault()
        const first = Object.values(err.errors ?? {})[0]?.[0]
        setApiError(first || err.message || "L'opération a échoué.")
      } else if (err instanceof TypeError && /fetch/i.test(err.message)) {
        e.preventDefault()
        setApiError("Le serveur ne répond pas. Vérifiez que le backend est démarré.")
      }
    }
    window.addEventListener("unhandledrejection", onRejection)
    return () => window.removeEventListener("unhandledrejection", onRejection)
  }, [])

  useEffect(() => {
    if (!apiError) return
    const timer = setTimeout(() => setApiError(null), 8000)
    return () => clearTimeout(timer)
  }, [apiError])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <aside
        style={{
          width: 240,
          background: "#0B3D91",
          color: "#fff",
          padding: "24px 16px",
          flexShrink: 0,
        }}
      >
        <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>
          <div style={{ marginBottom: 28 }}>
            {/* White version of the parish logo on the blue sidebar */}
            <img
              src={logoImg}
              alt="Paroisse Saint Dominique Savio"
              style={{
                width: "100%",
                maxWidth: 190,
                height: "auto",
                display: "block",
                filter: "brightness(0) invert(1)",
              }}
            />
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.7)",
                marginTop: 8,
              }}
            >
              ADMINISTRATION
            </div>
          </div>
        </Link>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) =>
            "children" in item ? (
              <NavSection key={item.label} group={item} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                style={({ isActive }) => linkStyle(isActive)}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#F5F7FA",
        }}
      >
        <header
          style={{
            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            padding: "14px 24px",

            background: "#fff",

            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              textDecoration: "none",
            }}
          >
            <Icon name="arrowLeft" size={14} strokeWidth={1.75} /> Retour au
            site public
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: "0.85rem", color: "#1c2340" }}>
              {user?.prenom} {user?.nom}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "none",

                border: "1px solid #e5e7eb",

                borderRadius: 8,

                padding: "6px 12px",

                fontSize: "0.85rem",

                cursor: "pointer",
              }}
            >
              Déconnexion
            </button>
          </div>
        </header>
        <main style={{ flex: 1, padding: 24 }}>
          <Outlet />
        </main>
      </div>
      <ConfirmHost />
      {apiError && (
        <div
          role="alert"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 1000,
            maxWidth: 420,
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "12px 40px 12px 14px",
            fontSize: "0.85rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          }}
        >
          <strong style={{ display: "block", marginBottom: 2 }}>Erreur</strong>
          {apiError}
          <button
            type="button"
            onClick={() => setApiError(null)}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              background: "none",
              border: "none",
              color: "#991b1b",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
