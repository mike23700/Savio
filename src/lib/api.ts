const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "savio_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.message || res.statusText, data?.errors);
  }

  return data as T;
}

export const apiGet = <T,>(path: string) => request<T>(path, { method: "GET" });
export const apiPost = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body ?? {}) });
export const apiPut = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) });

/**
 * Multipart upload helper. The browser sets the multipart Content-Type
 * (with boundary) itself, so we must not set any Content-Type header —
 * hence the dedicated path instead of request().
 *
 * PHP cannot parse multipart bodies on PUT requests, so for updates we
 * use Laravel's method spoofing: a POST carrying _method=PUT.
 */
export async function apiFormData<T>(path: string, body: FormData, method: "POST" | "PUT" = "POST"): Promise<T> {
  if (method === "PUT" && !body.has("_method")) {
    body.append("_method", "PUT");
  }
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: method === "PUT" ? "POST" : method,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.message || res.statusText, data?.errors);
  }

  return data as T;
}
export const apiPatch = <T,>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) });
export const apiDelete = <T,>(path: string) => request<T>(path, { method: "DELETE" });

/** Local date of the visitor's device as "YYYY-MM-DD". */
export function localDateISO(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Query string carrying the visitor's device clock so time-sensitive
 * endpoints ("next mass", "today's program") are computed with the date
 * and time shown on the user's computer:
 *   ?tz=Africa/Douala&now=2026-09-23T14:05:00[&extra params]
 */
export function clientTimeQuery(extra: Record<string, string | number | boolean> = {}): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const params = new URLSearchParams();
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) params.set("tz", tz);
  } catch {
    // timezone unavailable → server falls back to its own
  }
  params.set("now", `${localDateISO(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
  for (const [k, v] of Object.entries(extra)) params.set(k, String(typeof v === "boolean" ? Number(v) : v));
  return `?${params.toString()}`;
}

/** Resolve a stored media path ("news/x.jpg") to a servable URL. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path; // external URL kept as-is
  return `/storage/${path}`;
}
