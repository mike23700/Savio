import type { CSSProperties, ReactNode } from "react";

/**
 * Single icon set for the whole site.
 *
 * Style reference: the "Nos services aux fidèles" tiles on the home page — thin
 * 1.5 strokes, round caps and joins, no fill, 24×24 grid, colour inherited from
 * `currentColor` so an icon always matches the text it sits next to.
 *
 * Every icon is a stroke drawing on the same 24×24 grid, so a single `size`
 * keeps them optically aligned wherever they are mixed.
 */
const PATHS = {
  // ── Navigation ──────────────────────────────────────────────────────────
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  arrowUp: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
  arrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
  arrowUpRight: <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>,
  chevronDown: <polyline points="6 9 12 15 18 9" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,

  // ── Actions ─────────────────────────────────────────────────────────────
  check: <polyline points="20 6 9 17 4 12" />,
  checkCircle: <><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></>,
  info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,

  // ── Parish & faith ──────────────────────────────────────────────────────
  church: <><path d="M3 21h18M3 10h18M5 21V10M19 21V10M12 3L3 10h18L12 3z" /><path d="M12 3V1M10 6h4" /></>,
  cross: <><line x1="12" y1="2" x2="12" y2="22" /><line x1="4" y1="9" x2="20" y2="9" /></>,
  pray: <><path d="M18 11V7a2 2 0 0 0-4 0v4M14 11V5a2 2 0 0 0-4 0v6M10 11V7a2 2 0 0 0-4 0v4" /><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L8 17V7" /></>,
  hand: <><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" /><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" /><path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-3.5a1.5 1.5 0 0 1 3 0" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  bookOpen: <><path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" /><path d="M12 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" /></>,
  books: <><path d="M4 4h5v16H4z" /><path d="M11 4h5v16h-5z" /><path d="M18 5l4-1 2 15-4 1z" /></>,
  scroll: <><path d="M5 3h11a2 2 0 0 1 2 2v1.5a2 2 0 1 0 0 3V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M7 9h7M7 13h5" /></>,
  sparkle: <><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" /><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" /></>,

  // ── People ──────────────────────────────────────────────────────────────
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  ring: <><circle cx="9" cy="15" r="6" /><circle cx="15" cy="15" r="6" /></>,

  // ── Place & time ────────────────────────────────────────────────────────
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  timer: <><circle cx="12" cy="13.5" r="8" /><path d="M12 10v3.5l2 2" /><line x1="9" y1="2" x2="15" y2="2" /></>,
  hourglass: <><path d="M5 22h14M5 2h14" /><path d="M17 22v-3.5a2 2 0 0 0-.6-1.4L12 12l-4.4 5.1a2 2 0 0 0-.6 1.4V22" /><path d="M7 2v3.5a2 2 0 0 0 .6 1.4L12 12l4.4-5.1a2 2 0 0 0 .6-1.4V2" /></>,
  mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  landmark: <><path d="M3 22h18M4 18V9M9 18V9M15 18V9M20 18V9" /><path d="M2 9l10-6 10 6z" /></>,
  bed: <><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" /></>,
  megaphone: <><path d="M3 10v4a1 1 0 0 0 1 1h3l7 5V4L7 9H4a1 1 0 0 0-1 1z" /><path d="M18 9a4 4 0 0 1 0 6" /></>,

  // ── Media & documents ───────────────────────────────────────────────────
  play: <polygon points="6 3 20 12 6 21 6 3" />,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
  images: <><rect x="8" y="3" width="13" height="13" rx="2" /><path d="M16 13l-3.5-3.5L6 16" /><circle cx="13" cy="7.5" r="1" /><path d="M5 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v0" /></>,
  fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="15" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></>,
  newspaper: <><path d="M4 4h13a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z" /><path d="M18 8h2a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2" /><line x1="7" y1="8" x2="13" y2="8" /><line x1="7" y1="12" x2="13" y2="12" /><line x1="7" y1="16" x2="11" y2="16" /></>,
  clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></>,
  smartphone: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,

  // ── Shop & money ────────────────────────────────────────────────────────
  bag: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" /></>,
  banknote: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><line x1="6" y1="9" x2="6.01" y2="9" /><line x1="18" y1="15" x2="18.01" y2="15" /></>,
  coins: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></>,

  // ── Work & tools ────────────────────────────────────────────────────────
  hammer: <><path d="M14 3l7 7-4 4-7-7 4-4z" /><path d="M10 7L3 14l7 7 7-7" /></>,
  sprout: <><path d="M12 21V10" /><path d="M12 10c0-3.3 2.4-6 6-6 0 3.6-2.6 6-6 6z" /><path d="M12 14c0-2.8-2-5-5-5 0 3 2 5 5 5z" /></>,

  // ── Contact ─────────────────────────────────────────────────────────────
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><polyline points="22 6 12 13 2 6" /></>,
  message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,

  // ── Social ──────────────────────────────────────────────────────────────
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20.5l1.8-5A8.5 8.5 0 1 1 21 11.5z" /><path d="M8.9 9.1c.2-.5.4-.6.6-.6h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3-.1.6a6.4 6.4 0 0 0 2.7 2.4c.3.1.5 0 .6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.4.5a1.9 1.9 0 0 1-1.3 1.3c-.5.2-1.4.2-3.1-.7a8.4 8.4 0 0 1-3.5-3.8c-.5-1-.5-2-.4-2.6z" /></>,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><polygon points="10 9 16 12 10 15" /></>,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></>,
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  /** Rendered in px. Keeps every icon on the same optical scale when mixed. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Small icons (buttons, inline hints) read better slightly bolder. */
  strokeWidth?: number;
  /** Accessible name. Without it the icon is hidden from assistive tech. */
  title?: string;
}

export default function Icon({ name, size = 24, className = "", style, strokeWidth = 1.5, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {PATHS[name] as ReactNode}
    </svg>
  );
}
