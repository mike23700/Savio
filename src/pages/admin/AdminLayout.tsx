import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";

const NAV = [
  { label: "Tableau de bord", to: "/admin" },
  { label: "Horaires des messes", to: "/admin/horaires-messes" },
  { label: "Sacrements", to: "/admin/sacrements" },
  { label: "Catéchèse", to: "/admin/catechese" },
  { label: "Prière & Méditation", to: "/admin/priere" },
  { label: "Intentions de messe", to: "/admin/intentions" },
  { label: "Homélies", to: "/admin/homelies" },
  { label: "Mouvements & Groupes", to: "/admin/mouvements" },
  { label: "Projets paroissiaux", to: "/admin/projets" },
  { label: "Registre paroissial", to: "/admin/registre" },
  { label: "Produits boutique", to: "/admin/produits" },
  { label: "Commandes boutique", to: "/admin/commandes" },
  { label: "Dons", to: "/admin/dons" },
  { label: "Abonnements journal", to: "/admin/journal/abonnements" },
  { label: "Numéros du journal", to: "/admin/journal/numeros" },
  { label: "Tarifs journal", to: "/admin/journal/tarifs" },
  { label: "Paramètres", to: "/admin/parametres" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Montserrat, sans-serif" }}>
      <aside style={{ width: 240, background: "#0B3D91", color: "#fff", padding: "24px 16px", flexShrink: 0 }}>
        <Link to="/admin" style={{ color: "#fff", textDecoration: "none" }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 32 }}>
            Admin · Savio
          </div>
        </Link>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              style={({ isActive }) => ({
                color: "#fff",
                textDecoration: "none",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: "0.9rem",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F5F7FA" }}>
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
          <Link to="/" style={{ fontSize: "0.85rem", color: "#6b7280", textDecoration: "none" }}>
            ← Retour au site public
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
    </div>
  );
}
