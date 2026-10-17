import { useEffect, useMemo, useState } from "react"

import { Link, useSearchParams } from "react-router"

import { useSettings } from "@/lib/settings"

import { apiGet, mediaUrl } from "@/lib/api"

import {
  youtubeEmbed,
  youtubeThumb,
  type MediaCategory,
  type MediaItem,
} from "@/lib/content-types"

import { useLang } from "@/lib/i18n"

import Icon, { type IconName } from "@/components/Icon"

const ALL = "*"

type TabId = "galerie" | "videos" | "chants" | "boutique"

/**
 * Media library (photos + YouTube videos + cantiques/chants managed from /admin/mediatheque).
 * Served at /mediatheque and, without the shop tab, at /paroisse/mediatheque.
 */

export default function Mediatheque({
  fromParoisse = false,
}: {
  fromParoisse?: boolean
}) {
  const { t } = useLang()

  const settings = useSettings()

  const youtubeUrl = settings["social.youtube_url"] || "#"

  // The active tab lives in the URL (?onglet=videos, ?onglet=chants) so it can be linked to.

  const [params, setParams] = useSearchParams()

  const tabParam = params.get("onglet")

  const tab: TabId =
    tabParam === "videos" ||
    tabParam === "chants" ||
    (tabParam === "boutique" && !fromParoisse)
      ? tabParam
      : "galerie"

  const setTab = (next: TabId) =>
    setParams(next === "galerie" ? {} : { onglet: next }, { replace: true })

  const [galleryFilter, setGalleryFilter] = useState(ALL)

  const [videoFilter, setVideoFilter] = useState(ALL)

  const [chantCategory, setChantCategory] = useState(ALL)

  const [chantLangue, setChantLangue] = useState(ALL)

  const [chantSearch, setChantSearch] = useState("")

  const [lightbox, setLightbox] = useState<string | null>(null)

  const [playing, setPlaying] = useState<MediaItem | null>(null)

  const [items, setItems] = useState<MediaItem[]>([])

  const [categories, setCategories] = useState<MediaCategory[]>([])

  // Load, then reload whenever the visitor comes back to this tab/window, so

  // photos, videos and chants added from the admin show up without a manual refresh.

  useEffect(() => {
    function load() {
      apiGet<MediaItem[]>("/media")
        .then(setItems)
        .catch(() => {})

      apiGet<MediaCategory[]>("/media-categories")
        .then(setCategories)
        .catch(() => {})
    }

    load()

    const onVisible = () => {
      if (document.visibilityState === "visible") load()
    }

    document.addEventListener("visibilitychange", onVisible)

    window.addEventListener("focus", load)

    return () => {
      document.removeEventListener("visibilitychange", onVisible)

      window.removeEventListener("focus", load)
    }
  }, [])

  const photos = items.filter((i) => i.type === "photo")

  const videos = items.filter((i) => i.type === "video" && i.youtube_id)

  const chants = items.filter((i) => i.type === "chant")

  // Only list categories that have content for the current tab.

  const catsFor = (list: MediaItem[]) => [
    { value: ALL, label: t("top.common.tous") },

    ...categories
      .filter((c) => list.some((i) => i.media_category_id === c.id))
      .map((c) => ({ value: c.name, label: c.name })),
  ]

  const langues = useMemo(() => {
    const set = new Set<string>()

    for (const c of chants) {
      const l = (c.language || "").trim()

      if (l) set.add(l)
    }

    return [...set].sort((a, b) => a.localeCompare(b, "fr"))
  }, [chants])

  const tabs: { id: TabId icon: IconName label: string }[] = [
    {
      id: "galerie",
      icon: "camera",
      label: t("top.mediatheque.ongletGalerie").replace(
        "{count}",
        String(photos.length),
      ),
    },

    {
      id: "videos",
      icon: "play",
      label: t("top.mediatheque.ongletVideos").replace(
        "{count}",
        String(videos.length),
      ),
    },

    {
      id: "chants",
      icon: "music",
      label: t("top.mediatheque.ongletChants").replace(
        "{count}",
        String(chants.length),
      ),
    },

    { id: "boutique", icon: "bag", label: t("top.mediatheque.ongletBoutique") },
  ].filter((t) => !fromParoisse || t.id !== "boutique") as {
    id: TabId
    icon: IconName
    label: string
  }[]

  const filteredImgs = photos.filter(
    (img) => galleryFilter === ALL || img.category?.name === galleryFilter,
  )

  const filteredVideos = videos.filter(
    (v) => videoFilter === ALL || v.category?.name === videoFilter,
  )

  const filteredChants = chants.filter((c) => {
    if (chantCategory !== ALL && c.category?.name !== chantCategory)
      return false

    if (chantLangue !== ALL && (c.language || "").trim() !== chantLangue)
      return false

    const q = chantSearch.trim().toLowerCase()

    if (q && !(c.title || "").toLowerCase().includes(q)) return false

    return true
  })

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515657241610-a6b33f0f6c5a?w=1400&h=500&fit=crop&auto=format"
          alt={t("top.mediatheque.alt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {t("top.common.accueil")}
            </Link>
            <Icon
              name="chevronRight"
              size={13}
              strokeWidth={1.75}
              style={{ color: "rgba(255,255,255,0.4)" }}
            />
            {fromParoisse && (
              <>
                <Link
                  to="/paroisse"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {t("top.mediatheque.paroisse")}
                </Link>
                <Icon
                  name="chevronRight"
                  size={13}
                  strokeWidth={1.75}
                  style={{ color: "rgba(255,255,255,0.4)" }}
                />
              </>
            )}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.72rem",
                color: "#D4AF37",
              }}
            >
              {t("top.mediatheque.breadcrumb")}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              color: "white",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
            }}
          >
            {t("top.mediatheque.titre")}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
              marginTop: 6,
            }}
          >
            {t("top.mediatheque.sousTitre")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <section
        style={{ background: "#F5F7FA" }}
        className="px-4 py-6 sticky top-[73px] z-40 border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                background: tab === t.id ? "#0B3D91" : "white",
                color: tab === t.id ? "white" : "#374151",
                border:
                  tab === t.id ? "1px solid #0B3D91" : "1px solid #e5e7eb",
              }}
              className="px-5 py-2.5 rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2"
            >
              <Icon name={t.icon} size={16} strokeWidth={1.75} /> {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Galerie */}
      {tab === "galerie" && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {catsFor(photos).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setGalleryFilter(cat.value)}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    background:
                      galleryFilter === cat.value ? "#0B3D91" : "#F5F7FA",
                    color: galleryFilter === cat.value ? "white" : "#374151",
                    border: `1px solid ${
                      galleryFilter === cat.value ? "#0B3D91" : "#e5e7eb"
                    }`,
                  }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredImgs.length === 0 && (
                <p
                  className="col-span-full text-center py-10"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.88rem",
                    color: "#6b7280",
                  }}
                >
                  {t("top.mediatheque.aucunePhoto")}
                </p>
              )}
              {filteredImgs.map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
                  onClick={() => setLightbox(mediaUrl(img.image))}
                >
                  <img
                    src={mediaUrl(img.image) ?? undefined}
                    alt={img.title ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <Icon name="search" size={28} />
                    </span>
                  </div>
                  {img.category && (
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        background: "rgba(8,45,107,0.85)",
                        color: "#D4AF37",
                        letterSpacing: "0.08em",
                      }}
                      className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
                    >
                      {img.category.name.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {lightbox && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <img
                src={lightbox}
                alt={t("top.mediatheque.vueAgrandie")}
                className="max-w-full max-h-[90vh] rounded-xl object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                aria-label={t("top.common.fermer")}
                title={t("top.common.fermer")}
                onClick={() => setLightbox(null)}
              >
                <Icon name="close" size={20} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Vidéos */}
      {tab === "videos" && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {catsFor(videos).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setVideoFilter(cat.value)}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    background:
                      videoFilter === cat.value ? "#0B3D91" : "#F5F7FA",
                    color: videoFilter === cat.value ? "white" : "#374151",
                    border: `1px solid ${
                      videoFilter === cat.value ? "#0B3D91" : "#e5e7eb"
                    }`,
                  }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {filteredVideos.length === 0 ? (
              <p
                className="text-center py-10"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.88rem",
                  color: "#6b7280",
                }}
              >
                {t("top.mediatheque.aucuneVideo")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setPlaying(v)}
                    className="text-left rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group bg-white"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={youtubeThumb(v.youtube_id!)}
                        alt={v.title ?? ""}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(8,45,107,0.25)" }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            background: "#ff0000",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            name="play"
                            size={20}
                            strokeWidth={1.75}
                            style={{ color: "white", marginLeft: 3 }}
                          />
                        </div>
                      </div>
                      {v.category && (
                        <span
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            background: "rgba(8,45,107,0.85)",
                            color: "#D4AF37",
                            letterSpacing: "0.08em",
                          }}
                          className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full"
                        >
                          {v.category.name.toUpperCase()}
                        </span>
                      )}
                    </div>
                    {v.title && (
                      <div
                        className="p-4"
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          color: "#1c2340",
                          lineHeight: 1.4,
                        }}
                      >
                        {v.title}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {playing && playing.youtube_id && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setPlaying(null)}
            >
              <div
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={youtubeEmbed(playing.youtube_id)}
                    title={playing.title ?? t("top.mediatheque.video")}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {playing.title && (
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "white",
                      marginTop: 12,
                      fontSize: "0.95rem",
                    }}
                  >
                    {playing.title}
                  </p>
                )}
              </div>
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                aria-label={t("top.common.fermer")}
                title={t("top.common.fermer")}
                onClick={() => setPlaying(null)}
              >
                <Icon name="close" size={20} strokeWidth={1.75} />
              </button>
            </div>
          )}
          <div className="max-w-3xl mx-auto text-center pt-12">
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.88rem",
                color: "#6b7280",
                lineHeight: 1.7,
              }}
            >
              {t("top.mediatheque.youtubeTexte")}
            </p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#ff0000",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity"
            >
              <Icon name="play" size={16} strokeWidth={1.75} />{" "}
              {t("top.mediatheque.youtubeBouton")}
            </a>
          </div>
        </section>
      )}

      {/* Cantiques & Chants */}
      {tab === "chants" && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
              <input
                value={chantSearch}
                onChange={(e) => setChantSearch(e.target.value)}
                placeholder={t("top.mediatheque.rechercherChant")}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.85rem",
                  color: "#1c2340",
                }}
                className="w-full md:max-w-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={chantLangue}
                  onChange={(e) => setChantLangue(e.target.value)}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.8rem",
                  }}
                  className="border border-gray-200 rounded-full px-4 py-2 bg-white"
                >
                  <option value={ALL}>
                    {t("top.mediatheque.toutesLangues")}
                  </option>
                  {langues.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {catsFor(chants).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setChantCategory(cat.value)}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    background:
                      chantCategory === cat.value ? "#0B3D91" : "#F5F7FA",
                    color: chantCategory === cat.value ? "white" : "#374151",
                    border: `1px solid ${
                      chantCategory === cat.value ? "#0B3D91" : "#e5e7eb"
                    }`,
                  }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredChants.length === 0 ? (
              <p
                className="text-center py-10"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.88rem",
                  color: "#6b7280",
                }}
              >
                {t("top.mediatheque.aucunChant")}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredChants.map((c) => {
                  const audio = mediaUrl(c.audio_url)

                  const pdf = mediaUrl(c.pdf_url)

                  const hasBoth = !!(audio && pdf)

                  return (
                    <article
                      key={c.id}
                      className="rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-all"
                    >
                      <div className="p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {c.language && (
                            <span
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                background: "#0B3D91",
                                color: "white",
                                letterSpacing: "0.06em",
                              }}
                              className="px-2.5 py-1 rounded-full uppercase"
                            >
                              {c.language}
                            </span>
                          )}
                          {c.category && (
                            <span
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                background: "#FEF3C7",
                                color: "#92400E",
                                letterSpacing: "0.06em",
                              }}
                              className="px-2.5 py-1 rounded-full uppercase"
                            >
                              {c.category.name}
                            </span>
                          )}
                        </div>
                        <h3
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#1c2340",
                            lineHeight: 1.35,
                          }}
                        >
                          {c.title || "—"}
                        </h3>
                        <div
                          className="flex flex-wrap gap-3 mt-2"
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "0.72rem",
                            color: "#6b7280",
                          }}
                        >
                          {audio && (
                            <span className="inline-flex items-center gap-1">
                              <Icon name="music" size={14} strokeWidth={1.75} />{" "}
                              Audio
                            </span>
                          )}
                          {c.youtube_id && (
                            <span className="inline-flex items-center gap-1">
                              <Icon name="play" size={14} strokeWidth={1.75} />{" "}
                              Vidéo
                            </span>
                          )}
                          {pdf && (
                            <span className="inline-flex items-center gap-1">
                              <Icon
                                name="fileText"
                                size={14}
                                strokeWidth={1.75}
                              />{" "}
                              PDF
                            </span>
                          )}
                        </div>

                        {hasBoth && (
                          <p
                            className="mt-3"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontSize: "0.76rem",
                              color: "#0B3D91",
                              lineHeight: 1.6,
                            }}
                          >
                            {t("top.mediatheque.chantLireEnEcoutant")}
                          </p>
                        )}

                        {audio && (
                          <div className="mt-4">
                            <audio
                              controls
                              src={audio}
                              className="w-full"
                              preload="none"
                            >
                              {t("top.mediatheque.audioNonSupporte")}
                            </audio>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                          {c.youtube_id && (
                            <button
                              onClick={() => setPlaying(c)}
                              style={{
                                background: "#ff0000",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                              }}
                              className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                            >
                              <Icon name="play" size={15} strokeWidth={1.75} />{" "}
                              {t("top.mediatheque.voirVideo")}
                            </button>
                          )}
                          {pdf && (
                            <>
                              <a
                                href={pdf}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: "#0B3D91",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                }}
                                className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                              >
                                <Icon
                                  name="bookOpen"
                                  size={15}
                                  strokeWidth={1.75}
                                />{" "}
                                {t("top.mediatheque.lireParoles")}
                              </a>
                              <a
                                href={pdf}
                                download
                                style={{
                                  border: "1px solid #0B3D91",
                                  color: "#0B3D91",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-blue-50 transition-all"
                              >
                                <Icon
                                  name="download"
                                  size={15}
                                  strokeWidth={1.75}
                                />{" "}
                                PDF
                              </a>
                            </>
                          )}
                          {audio && (
                            <a
                              href={audio}
                              download
                              style={{
                                border: "1px solid #e5e7eb",
                                color: "#374151",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all"
                            >
                              <Icon
                                name="download"
                                size={15}
                                strokeWidth={1.75}
                              />{" "}
                              {t("top.mediatheque.telechargerAudio")}
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
          {playing && playing.type === "chant" && playing.youtube_id && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setPlaying(null)}
            >
              <div
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={youtubeEmbed(playing.youtube_id)}
                    title={playing.title ?? t("top.mediatheque.video")}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {playing.title && (
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "white",
                      marginTop: 12,
                      fontSize: "0.95rem",
                    }}
                  >
                    {playing.title}
                  </p>
                )}
              </div>
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                aria-label={t("top.common.fermer")}
                title={t("top.common.fermer")}
                onClick={() => setPlaying(null)}
              >
                <Icon name="close" size={20} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Boutique */}
      {tab === "boutique" && (
        <section id="boutique" className="py-12 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center py-10">
            <div className="mb-5">
              <Icon name="bag" size={44} style={{ color: "#0B3D91" }} />
            </div>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1c2340",
              }}
            >
              {t("top.mediatheque.boutiqueTitre")}
            </h2>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.88rem",
                color: "#6b7280",
                marginTop: 8,
                lineHeight: 1.7,
              }}
            >
              {t("top.mediatheque.boutiqueTexte")}
            </p>
            <Link
              to="/boutique"
              style={{
                background: "#0B3D91",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity"
            >
              {t("top.mediatheque.boutiqueCta")}{" "}
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
