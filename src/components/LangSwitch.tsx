import { useLang } from "@/lib/i18n";

const OPTIONS = [
  { code: "fr", short: "FR" },
  { code: "en", short: "EN" },
] as const;

/** Bascule FR / EN du site public. Le choix est memorise dans localStorage. */
export default function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #e5e7eb",
        borderRadius: 999,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {OPTIONS.map((o) => {
        const active = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            lang={o.code}
            aria-pressed={active}
            title={t(`lang.${o.code}`)}
            onClick={() => setLang(o.code)}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: compact ? "0.62rem" : "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: compact ? "4px 8px" : "5px 10px",
              background: active ? "#0B3D91" : "transparent",
              color: active ? "#fff" : "#6b7280",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            className={active ? "" : "hover:bg-gray-50"}
          >
            {o.short}
          </button>
        );
      })}
    </div>
  );
}
