import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user?.role === "admin") {
    const from = (location.state as { from?: Location })?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedIn = await login(email, password);
      if (loggedIn.role !== "admin") {
        setError("Ce compte n'a pas les droits administrateur.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B3D91", fontFamily: "Montserrat, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, padding: 40, width: 360 }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", color: "#1c2340", marginBottom: 24, textAlign: "center" }}>
          Administration
        </h1>
        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
            {error}
          </div>
        )}
        <label style={{ display: "block", fontSize: "0.8rem", color: "#6b7280", marginBottom: 6 }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 16 }}
        />
        <label style={{ display: "block", fontSize: "0.8rem", color: "#6b7280", marginBottom: 6 }}>Mot de passe</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 24 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", background: "#0B3D91", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
