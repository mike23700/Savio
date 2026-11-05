import { useEffect, useMemo, useRef, useState } from "react"

import { mediaUrl } from "@/lib/api"

import { useLang } from "@/lib/i18n"

import { useSettings } from "@/lib/settings"

import Icon from "@/components/Icon"

/** A background track configured in admin → Bannières, textes & musique. */
export interface MusicTrack {
  title: string
  /** Uploaded file path ("musique/x.mp3") or a direct audio URL. */
  url: string
}

export function parseTracks(
  raw: string | undefined,
  { keepEmpty = false }: { keepEmpty?: boolean } = {},
): MusicTrack[] {
  try {
    const list = raw ? JSON.parse(raw) : []
    // The admin keeps rows still being filled in; the player skips them.
    return Array.isArray(list)
      ? list.filter(
          (t): t is MusicTrack =>
            typeof t?.url === "string" && (keepEmpty || t.url !== ""),
        )
      : []
  } catch {
    return []
  }
}

const PAUSED_KEY = "savio.music.paused"

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(PAUSED_KEY) === "1"
  } catch {
    return false
  }
}

function writePaused(paused: boolean) {
  try {
    window.localStorage.setItem(PAUSED_KEY, paused ? "1" : "0")
  } catch {
    // ignore storage errors
  }
}

/**
 * Site-wide background music: plays the admin playlist in a loop. Browsers
 * block sound until the visitor interacts with the page, so playback starts on
 * the first click / key press (unless the visitor paused it before — that
 * choice is remembered). A small floating button toggles play / pause.
 */
export default function BackgroundMusic() {
  const settings = useSettings()

  const { t } = useLang()

  const enabled = settings["music.enabled"] === "1"

  const volume = Math.min(1, Math.max(0, Number(settings["music.volume"] ?? "0.35") || 0.35))

  const tracks = useMemo(() => parseTracks(settings["music.tracks"]), [settings])

  const audio = useRef<HTMLAudioElement>(null)

  const [index, setIndex] = useState(0)

  const [playing, setPlaying] = useState(false)

  const [pausedByUser, setPausedByUser] = useState(readPaused)

  const active = enabled && tracks.length > 0

  const current = active ? tracks[index % tracks.length] : null

  const src = current ? (mediaUrl(current.url) ?? current.url) : undefined

  // Start on the first interaction, as autoplay with sound is blocked.
  useEffect(() => {
    if (!active || pausedByUser) return
    const start = () => {
      audio.current?.play().catch(() => {})
    }
    start()
    const events = ["pointerdown", "keydown", "touchstart"] as const
    events.forEach((e) => window.addEventListener(e, start, { once: true }))
    return () => events.forEach((e) => window.removeEventListener(e, start))
  }, [active, pausedByUser])

  useEffect(() => {
    if (audio.current) audio.current.volume = volume
  }, [volume, src])

  // Keep playing when the track changes.
  useEffect(() => {
    if (playing) audio.current?.play().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  if (!active || !src) return null

  function toggle() {
    const el = audio.current
    if (!el) return
    if (playing) {
      el.pause()
      setPausedByUser(true)
      writePaused(true)
    } else {
      setPausedByUser(false)
      writePaused(false)
      el.play().catch(() => {})
    }
  }

  return (
    <>
      <audio
        ref={audio}
        src={src}
        preload="none"
        // a single track loops on itself; a playlist moves to the next one
        loop={tracks.length === 1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setIndex((i) => (i + 1) % tracks.length)}
        onError={() => tracks.length > 1 && setIndex((i) => (i + 1) % tracks.length)}
      />
      <div
        className="fixed z-50 flex items-center gap-1 rounded-full shadow-lg"
        style={{ left: 16, bottom: 16, background: "#0B3D91", color: "white", padding: 4 }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t("extra.musique.pause") : t("extra.musique.jouer")}
          title={
            (playing ? t("extra.musique.pause") : t("extra.musique.jouer")) +
            (current?.title ? ` — ${current.title}` : "")
          }
          className="flex items-center justify-center rounded-full hover:bg-white/15"
          style={{ width: 40, height: 40 }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <Icon name="music" size={18} strokeWidth={2} />
          )}
        </button>
        {playing && tracks.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % tracks.length)}
            aria-label={t("extra.musique.suivant")}
            title={t("extra.musique.suivant")}
            className="flex items-center justify-center rounded-full hover:bg-white/15"
            style={{ width: 32, height: 40 }}
          >
            <Icon name="chevronRight" size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </>
  )
}
