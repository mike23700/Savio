import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { apiGet, mediaUrl } from "@/lib/api";
import { type NewsArticle, type NewsCategory } from "@/lib/content-types";
import { useLang } from "@/lib/i18n";
import Icon from "@/components/Icon";

const ALL = "*";

export function ActualiteDetail() {
  const { t, lang } = useLang();
  const { id } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    setStatus("loading");
    apiGet<NewsArticle>(`/news/${id}`)
      .then((a) => { setArticle(a); setStatus("ok"); })
      .catch(() => setStatus("missing"));
    apiGet<NewsArticle[]>("/news").then(setRelated).catch(() => {});
  }, [id]);

  if (status === "loading") {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center" style={{ fontFamily: "Montserrat, sans-serif", color: "#6b7280" }}>{t("top.common.chargement")}</div>;
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="mb-4"><Icon name="newspaper" size={40} style={{ color: "#9ca3af" }} /></div>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1c2340" }}>{t("top.actualites.introuvable")}</h2>
        <Link to="/actualites" style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90">
          {t("top.actualites.retour")} <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-72 md:h-96 overflow-hidden">
        {article.img && <img src={mediaUrl(article.img) ?? undefined} alt={article.title} className="w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.3) 60%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.common.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <Link to="/actualites" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.actualites.breadcrumb")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{article.category?.name ?? t("top.actualites.article")}</span>
          </div>
          {article.category && (
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem", fontWeight: 700, background: article.category.color, color: "white", letterSpacing: "0.08em" }}
              className="inline-block px-3 py-1 rounded-full mb-3">{article.category.name.toUpperCase()}</span>
          )}
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 700, lineHeight: 1.2 }}>{article.title}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", marginTop: 8 }}>{fmtDate(article.published_at)}</p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", color: "#4b5563", lineHeight: 1.85, marginBottom: 24, fontStyle: "italic", borderLeft: "3px solid #D4AF37", paddingLeft: 20 }}>
          {article.excerpt}
        </p>
        <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.92rem", color: "#374151", lineHeight: 1.9, whiteSpace: "pre-line" }}>
          {article.content}
        </div>
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-3">
          <Link to="/actualites"
            style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
            className="flex items-center gap-1 px-5 py-2.5 rounded-full hover:bg-blue-50 transition-all">
            <Icon name="arrowLeft" size={16} /> {t("top.actualites.toutes")}
          </Link>
          <Link to="/contact"
            style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem" }}
            className="flex items-center gap-1 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            {t("top.actualites.nousContacter")} <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        {/* Related */}
        <div className="mt-14">
          <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340", marginBottom: 20 }}>{t("top.actualites.similaires")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related
              .filter(n => n.id !== article.id)
              .sort((a, b) => Number(b.news_category_id === article.news_category_id) - Number(a.news_category_id === article.news_category_id))
              .slice(0, 2)
              .map(n => (
              <Link to={`/actualites/${n.id}`} key={n.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
                {n.img && <img src={mediaUrl(n.img) ?? undefined} alt={n.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="p-4">
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", color: "#9ca3af" }}>{fmtDate(n.published_at)}</div>
                  <h4 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.9rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.4, marginTop: 4 }}>{n.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

export default function Actualites() {
  const { t, lang } = useLang();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [activeTag, setActiveTag] = useState(ALL);
  const [search, setSearch] = useState("");
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    apiGet<NewsArticle[]>("/news").then(setNews).catch(() => {});
    apiGet<NewsCategory[]>("/news-categories").then(setCategories).catch(() => {});
  }, []);

  // Only offer categories that actually have published articles.
  const ALL_TAGS = [
    { value: ALL, label: t("top.common.tous") },
    ...categories.filter(c => news.some(n => n.news_category_id === c.id)).map(c => ({ value: c.name, label: c.name })),
  ];

  const filtered = news.filter(n => {
    const matchTag = activeTag === ALL || n.category?.name === activeTag;
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || (n.excerpt ?? "").toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  return (
    <>
      <div className="relative h-64 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1535361251-cbe9d0d2357d?w=1400&h=500&fit=crop&auto=format"
          alt={t("top.actualites.alt")} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>{t("top.common.accueil")}</Link>
            <Icon name="chevronRight" size={13} strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{t("top.actualites.breadcrumb")}</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>{t("top.actualites.titre")}</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>
            {t("top.actualites.sousTitre")}
          </p>
        </div>
      </div>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("top.actualites.placeholder")}
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#1c2340" }}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map(tag => (
                <button key={tag.value} onClick={() => setActiveTag(tag.value)}
                  style={{
                    fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", fontWeight: 700,
                    background: activeTag === tag.value ? "#0B3D91" : "white",
                    color: activeTag === tag.value ? "white" : "#374151",
                    border: activeTag === tag.value ? "1px solid #0B3D91" : "1px solid #e5e7eb",
                  }}
                  className="px-4 py-2 rounded-full hover:opacity-90 transition-all whitespace-nowrap">
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4"><Icon name="search" size={40} style={{ color: "#9ca3af" }} /></div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280" }}>{t("top.actualites.aucunResultat")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(n => (
                <Link to={`/actualites/${n.id}`} key={n.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 hover:border-yellow-200">
                  <div className="relative h-48 overflow-hidden">
                    {n.img && <img src={mediaUrl(n.img) ?? undefined} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    {n.category && (
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.62rem", fontWeight: 700, background: n.category.color, color: "white", letterSpacing: "0.08em" }}
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full">{n.category.name.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.7rem", color: "#9ca3af", marginBottom: 6 }}>{fmtDate(n.published_at)}</div>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.45, marginBottom: 8 }}>{n.title}</h3>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.7, marginBottom: 12 }}>{(n.excerpt ?? "").slice(0, 120)}{(n.excerpt ?? "").length > 120 ? "…" : ""}</p>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.76rem", color: "#0B3D91", fontWeight: 700 }}
                      className="flex items-center gap-1">{t("top.actualites.lireLaSuite")}<Icon name="arrowRight" size={16} /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
