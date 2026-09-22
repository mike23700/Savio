import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { apiGet } from "@/lib/api";

interface Product {
  id: number;
  nom: string;
  slug: string;
  prix: number;
  prix_barre: number | null;
  category: string;
  img: string;
  description: string;
}

export default function BoutiqueDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setProduct(null);
    setNotFound(false);
    apiGet<Product>(`/products/${id}`).then(setProduct).catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 700, color: "#1c2340" }}>Produit introuvable</h1>
        <Link to="/boutique"
          style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
          ← Retour à la boutique
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#6b7280" }}>Accueil</Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <Link to="/boutique" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#6b7280" }}>Boutique</Link>
          <span style={{ color: "#d1d5db" }}>›</span>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>{product.nom}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="rounded-2xl overflow-hidden">
            <img src={product.img} alt={product.nom} className="w-full h-80 object-cover" />
          </div>
          <div>
            <span style={{ background: product.category === "Livres" ? "#E8F2FF" : "#FDF8E7", color: product.category === "Livres" ? "#0B3D91" : "#D4AF37", fontFamily: "Montserrat, sans-serif", fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
              {product.category}
            </span>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: 700, color: "#1c2340", marginTop: 12, marginBottom: 12 }}>{product.nom}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#0B3D91" }}>{product.prix.toLocaleString("fr-FR")} FCFA</span>
              {product.prix_barre && (
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", color: "#9ca3af", textDecoration: "line-through" }}>{product.prix_barre.toLocaleString("fr-FR")} FCFA</span>
              )}
            </div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.8, marginBottom: 28 }}>{product.description}</p>
            <Link to="/boutique"
              style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              🛒 Voir la boutique pour commander
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
