import { useEffect, useState } from "react"

import { Link, useParams } from "react-router"

import { apiGet, mediaUrl } from "@/lib/api"

import { addToStoredCart } from "@/lib/cart"

import { useSettings } from "@/lib/settings"

import { useLang } from "@/lib/i18n"

import Icon from "@/components/Icon"

interface Product {
  id: number

  nom: string

  slug: string

  prix: number

  prix_barre: number | null

  category: string

  img: string
  images: string[] | null
  description: string
}

export default function BoutiqueDetail() {
  const { t, lang } = useLang()

  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)

  const [notFound, setNotFound] = useState(false)

  const [activeImg, setActiveImg] = useState(0)

  const [qty, setQty] = useState(1)

  const [added, setAdded] = useState(false)

  const settings = useSettings()

  useEffect(() => {
    if (!id) return

    setProduct(null)
    setNotFound(false)
    setActiveImg(0)
    setQty(1)
    setAdded(false)

    apiGet<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-4">
          <Icon name="cart" size={48} style={{ color: "#9ca3af" }} />
        </div>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#1c2340",
          }}
        >
          {t("top.boutiqueDetail.introuvable")}
        </h1>
        <Link
          to="/boutique"
          style={{
            background: "#0B3D91",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "0.83rem",
          }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity"
        >
          <Icon name="arrowLeft" size={16} /> {t("top.boutiqueDetail.retour")}
        </Link>
      </div>
    )
  }

  if (!product) return null

  const gallery = [product.img, ...(product.images ?? [])]
    .map((p) => mediaUrl(p))
    .filter((u): u is string => !!u)
    .slice(0, 3)

  const locale = lang === "en" ? "en-GB" : "fr-FR"

  const whatsapp = (settings["parish.whatsapp_number"] || "237655529999").replace(/\D/g, "")

  const contactText = encodeURIComponent(
    `${lang === "en" ? "Hello, I am interested in" : "Bonjour, je suis intéressé(e) par"} « ${product.nom} » (${product.prix.toLocaleString(locale)} FCFA) — ${window.location.href}`,
  )

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Link
            to="/"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.72rem",
              color: "#6b7280",
            }}
          >
            {t("top.common.accueil")}
          </Link>
          <Icon
            name="chevronRight"
            size={13}
            strokeWidth={1.75}
            style={{ color: "#d1d5db" }}
          />
          <Link
            to="/boutique"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.72rem",
              color: "#6b7280",
            }}
          >
            {t("top.boutique.breadcrumb")}
          </Link>
          <Icon
            name="chevronRight"
            size={13}
            strokeWidth={1.75}
            style={{ color: "#d1d5db" }}
          />
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.72rem",
              color: "#D4AF37",
            }}
          >
            {product.nom}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: "#F5F7FA", height: 460 }}
            >
              {gallery[activeImg] && (
                <img
                  src={gallery[activeImg]}
                  alt={product.nom}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: 64,
                      height: 96,
                      border: `2px solid ${i === activeImg ? "#0B3D91" : "#e5e7eb"}`,
                    }}
                    aria-label={`${product.nom} ${i + 1}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <span
              style={{
                background:
                  product.category === "Livres" ? "#E8F2FF" : "#FDF8E7",
                color: product.category === "Livres" ? "#0B3D91" : "#D4AF37",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              {product.category}
            </span>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#1c2340",
                marginTop: 12,
                marginBottom: 12,
              }}
            >
              {product.nom}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#0B3D91",
                }}
              >
                {product.prix.toLocaleString(lang === "en" ? "en-GB" : "fr-FR")}{" "}
                FCFA
              </span>
              {product.prix_barre && (
                <span
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "1rem",
                    color: "#9ca3af",
                    textDecoration: "line-through",
                  }}
                >
                  {product.prix_barre.toLocaleString(
                    lang === "en" ? "en-GB" : "fr-FR",
                  )}{" "}
                  FCFA
                </span>
              )}
            </div>
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.9rem",
                color: "#4b5563",
                lineHeight: 1.8,
                marginBottom: 28,
              }}
            >
              {product.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 hover:bg-gray-50"
                  aria-label="−"
                >
                  −
                </button>
                <span style={{ minWidth: 32, textAlign: "center", fontWeight: 700 }}>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-3 hover:bg-gray-50"
                  aria-label="+"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToStoredCart(product.id, qty)
                  setAdded(true)
                }}
                style={{
                  background: "#0B3D91",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Icon name="cart" size={18} strokeWidth={1.75} />
                {t("extra.boutique.ajouterPanier")}
              </button>
              <a
                href={`https://wa.me/${whatsapp}?text=${contactText}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl hover:bg-green-50 transition-colors"
              >
                <Icon name="whatsapp" size={18} strokeWidth={1.75} />
                {t("extra.boutique.contacterVendeur")}
              </a>
            </div>
            {added && (
              <div
                className="mt-4 flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "#dcfce7", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#166534" }}
              >
                <Icon name="checkCircle" size={18} />
                {t("extra.boutique.ajoute")}
                <Link to="/boutique?panier=1" style={{ fontWeight: 700, textDecoration: "underline" }}>
                  {t("extra.boutique.voirPanier")}
                </Link>
              </div>
            )}
            <Link
              to="/boutique"
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#0B3D91" }}
              className="inline-flex items-center gap-1 mt-5 hover:underline"
            >
              <Icon name="arrowLeft" size={14} /> {t("top.boutiqueDetail.voirBoutique")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
