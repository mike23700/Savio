import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { apiGet, apiPost, getToken, setToken } from "@/lib/api";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string | null;
  role: "member" | "admin";
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { nom: string; prenom: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    apiGet<User>("/auth/me")
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { user, token } = await apiPost<{ user: User; token: string }>("/auth/login", { email, password });
    setToken(token);
    setUser(user);
    return user;
  }

  async function register(data: { nom: string; prenom: string; email: string; phone?: string; password: string; password_confirmation: string }) {
    const { user, token } = await apiPost<{ user: User; token: string }>("/auth/register", data);
    setToken(token);
    setUser(user);
    return user;
  }

  async function logout() {
    try {
      await apiPost("/auth/logout");
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/espace-paroissien" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
