import type { ReactNode } from "react"

import Icon, { type IconName } from "@/components/Icon"

/**
 * Building blocks of the "Formulaire de demande" layout (sacrements,
 * intention de messe, publication des bans): numbered steps with a round
 * icon on a vertical line, labelled fields and the − / + buttons used to
 * add or remove repeated rows.
 */

const font = { fontFamily: "Montserrat, sans-serif" }

export const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"

export const inputStyle = { ...font, fontSize: "0.88rem", color: "#1c2340" }

export function FormTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        ...font,
        fontSize: "1.45rem",
        fontWeight: 500,
        color: "#1f2937",
        marginBottom: 8,
      }}
    >
      {children}
    </h2>
  )
}

export function FormStep({
  icon,
  title,
  desc,
  children,
}: {
  icon: IconName
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <div className="relative pl-14 pb-10 last:pb-4">
      {/* vertical line linking the steps */}
      <div
        className="absolute top-10 bottom-0"
        style={{ left: 19, width: 1, background: "#d1d5db" }}
      />
      <div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, background: "#0B8BD9", color: "white" }}
      >
        <Icon name={icon} size={18} strokeWidth={2} />
      </div>
      <div style={{ ...font, fontSize: "1.1rem", fontWeight: 500, color: "#1f2937", lineHeight: 1.2 }}>
        {title}
      </div>
      {desc && (
        <div style={{ ...font, fontSize: "0.78rem", color: "#9ca3af", marginTop: 2 }}>
          {desc}
        </div>
      )}
      <div className="mt-6">{children}</div>
    </div>
  )
}

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span
        className="block mb-2"
        style={{ ...font, fontSize: "0.85rem", fontWeight: 500, color: "#4b5563" }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

/** Grey "−" and blue "+" buttons, as on the reference form. */
export function PlusMinus({
  onAdd,
  onRemove,
  canRemove,
  addLabel,
  removeLabel,
}: {
  onAdd: () => void
  onRemove: () => void
  canRemove: boolean
  addLabel: string
  removeLabel: string
}) {
  return (
    <div className="flex justify-end gap-4 mt-4">
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={removeLabel}
        title={removeLabel}
        className="rounded-sm text-white flex items-center justify-center disabled:opacity-40"
        style={{ width: 57, height: 32, background: "#808080", fontWeight: 700 }}
      >
        −
      </button>
      <button
        type="button"
        onClick={onAdd}
        aria-label={addLabel}
        title={addLabel}
        className="rounded-sm text-white flex items-center justify-center"
        style={{ width: 57, height: 32, background: "#3434D0", fontWeight: 700 }}
      >
        +
      </button>
    </div>
  )
}

export function SubmitButton({
  children,
  disabled,
}: {
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="text-white rounded-sm px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
      style={{
        ...font,
        background: "#3434D0",
        fontWeight: 700,
        fontSize: "0.85rem",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  )
}

export function FormMessage({
  kind,
  children,
}: {
  kind: "error" | "success"
  children: ReactNode
}) {
  return (
    <div
      className="rounded-lg px-4 py-3 mb-4"
      style={{
        ...font,
        fontSize: "0.85rem",
        background: kind === "error" ? "#fee2e2" : "#dcfce7",
        color: kind === "error" ? "#991b1b" : "#166534",
      }}
    >
      {children}
    </div>
  )
}
