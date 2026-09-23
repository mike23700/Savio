import { useEffect, useRef, useState } from "react";

export interface ConfirmOptions {
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red "destructive" styling (default) or neutral blue. */
  tone?: "danger" | "primary";
}

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

// The mounted <ConfirmHost /> registers itself here so confirmDialog() can be
// called from any event handler, like window.confirm but styled.
let show: ((p: Pending) => void) | null = null;

/**
 * Promise-based replacement for window.confirm():
 *   if (!(await confirmDialog({ message: "Supprimer ce produit ?" }))) return;
 * A string is accepted as shorthand for { message }.
 */
export function confirmDialog(opts: ConfirmOptions | string): Promise<boolean> {
  const o = typeof opts === "string" ? { message: opts } : opts;
  return new Promise((resolve) => {
    if (show) show({ ...o, resolve });
    else resolve(window.confirm(typeof o.message === "string" ? o.message : "Confirmer ?"));
  });
}

/** Mount once (in AdminLayout). Renders the modal when confirmDialog() is called. */
export default function ConfirmHost() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [closing, setClosing] = useState(false);
  const cancelBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    show = (p) => { setClosing(false); setPending(p); };
    return () => { show = null; };
  }, []);

  function close(ok: boolean) {
    if (!pending || closing) return;
    setClosing(true);
    const { resolve } = pending;
    // let the exit animation play before unmounting
    setTimeout(() => { setPending(null); setClosing(false); resolve(ok); }, 140);
  }

  useEffect(() => {
    if (!pending) return;
    cancelBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") { e.preventDefault(); close(true); }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, closing]);

  if (!pending) return null;

  const danger = (pending.tone ?? "danger") === "danger";
  const accent = danger ? "#b91c1c" : "#0B3D91";

  return (
    <div
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(2px)",
        animation: `${closing ? "cd-fade-out" : "cd-fade-in"} 140ms ease forwards`,
      }}
    >
      <style>{`
        @keyframes cd-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cd-fade-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes cd-pop-in { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes cd-pop-out { from { opacity: 1; transform: none } to { opacity: 0; transform: translateY(8px) scale(.97) } }
      `}</style>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cd-title"
        aria-describedby="cd-message"
        style={{
          width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 24px 48px -12px rgba(15, 23, 42, 0.35)", fontFamily: "Montserrat, sans-serif",
          animation: `${closing ? "cd-pop-out" : "cd-pop-in"} 160ms ease forwards`,
        }}
      >
        <div style={{ padding: "24px 24px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: danger ? "#fee2e2" : "#E8F2FF", color: accent,
          }}>
            {danger ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="cd-title" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem", fontWeight: 700, color: "#1c2340", margin: 0 }}>
              {pending.title ?? (danger ? "Confirmer la suppression" : "Confirmation")}
            </h2>
            <div id="cd-message" style={{ fontSize: "0.87rem", color: "#4b5563", lineHeight: 1.6, marginTop: 6 }}>
              {pending.message}
            </div>
            {danger && (
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 8 }}>Cette action est définitive.</div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 24px", background: "#F8FAFC", borderTop: "1px solid #eef2f7" }}>
          <button
            ref={cancelBtn}
            type="button"
            onClick={() => close(false)}
            style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
          >
            {pending.cancelLabel ?? "Annuler"}
          </button>
          <button
            type="button"
            onClick={() => close(true)}
            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: accent, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
          >
            {pending.confirmLabel ?? (danger ? "Supprimer" : "Confirmer")}
          </button>
        </div>
      </div>
    </div>
  );
}
