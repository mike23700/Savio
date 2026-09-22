import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiGet, apiPost, ApiError } from "@/lib/api";

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

type CartItem = { id: number; qty: number };

const CATEGORIES = ["Tous", "Livres", "Accessoires"];

interface OrderResult {
  order: { order_number: string; total: number };
  payment: { instructions: string };
}

export default function Boutique() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("Tous");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ nom: "", prenom: "", email: "", telephone: "", payment_method: "orange_money" });
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Product[]>("/products").then(setProducts).catch(() => {});
  }, []);

  const filtered = products.filter(p => filter === "Tous" || p.category === filter);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
  };

  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id)! })).filter(c => c.product);
  const cartTotal = cartItems.reduce((sum, c) => sum + c.product.prix * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await apiPost<OrderResult>("/orders", {
        ...checkoutForm,
        email: checkoutForm.email || null,
        items: cartItems.map(c => ({ product_id: c.id, qty: c.qty })),
      });
      setOrderResult(result);
      setCart([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue, veuillez réessayer.");
    }
  }

  return (
    <>
      <div className="relative h-64 md:h-72 flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573591013318-b942d6ea1092?w=1400&h=500&fit=crop&auto=format" alt="Boutique" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,45,107,0.92) 0%, rgba(8,45,107,0.35) 60%, transparent 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>Accueil</Link>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", color: "#D4AF37" }}>Boutique</span>
          </div>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700 }}>Boutique paroissiale</h1>
          <p style={{ fontFamily: "Montserrat, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginTop: 6 }}>Livres, objets religieux et accessoires</p>
        </div>
      </div>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 700, background: filter === cat ? "#0B3D91" : "#F5F7FA", color: filter === cat ? "white" : "#374151", border: `1px solid ${filter === cat ? "#0B3D91" : "#e5e7eb"}` }}
                  className="px-5 py-2.5 rounded-full hover:opacity-90 transition-all">{cat}
                </button>
              ))}
            </div>
            <button onClick={() => setCartOpen(true)}
              style={{ background: "#D4AF37", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem", position: "relative" }}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              🛒 Panier
              {cartCount > 0 && (
                <span style={{ background: "#0B3D91", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-yellow-200 transition-all group">
                <Link to={`/boutique/${product.slug}`} className="relative h-48 overflow-hidden block">
                  <img src={product.img} alt={product.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span style={{ position: "absolute", top: 12, left: 12, background: product.category === "Livres" ? "#0B3D91" : "#D4AF37", borderRadius: 20, padding: "3px 10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "white" }}>
                    {product.category}
                  </span>
                </Link>
                <div className="p-5">
                  <Link to={`/boutique/${product.slug}`}>
                    <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "0.95rem", fontWeight: 700, color: "#1c2340", lineHeight: 1.3, marginBottom: 8 }}>{product.nom}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0B3D91" }}>
                      {product.prix.toLocaleString("fr-FR")} FCFA
                    </span>
                    {product.prix_barre && (
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "#9ca3af", textDecoration: "line-through" }}>
                        {product.prix_barre.toLocaleString("fr-FR")} FCFA
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addToCart(product.id)}
                      style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}
                      className="flex-1 text-white py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                      🛒 Ajouter
                    </button>
                    <Link to={`/boutique/${product.slug}`}
                      style={{ border: "2px solid #0B3D91", color: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem" }}
                      className="px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center">
                      Détail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setCartOpen(false)}>
          <div className="bg-white w-full max-w-sm h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340" }}>Mon panier</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🛒</div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", color: "#6b7280" }}>Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(({ id, qty, product }) => (
                    <div key={id} className="flex gap-3 items-start p-3 rounded-xl border border-gray-100">
                      <img src={product.img} alt={product.nom} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1c2340", lineHeight: 1.3 }}>{product.nom}</p>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: "#0B3D91", fontWeight: 700, marginTop: 2 }}>{product.prix.toLocaleString("fr-FR")} FCFA</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(id, qty - 1)} style={{ width: 24, height: 24, border: "1px solid #e5e7eb", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }} className="flex items-center justify-center hover:bg-gray-50">−</button>
                          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>{qty}</span>
                          <button onClick={() => updateQty(id, qty + 1)} style={{ width: 24, height: 24, border: "1px solid #e5e7eb", borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }} className="flex items-center justify-center hover:bg-gray-50">+</button>
                          <button onClick={() => removeFromCart(id)} style={{ marginLeft: "auto", color: "#ef4444", fontSize: "0.72rem", fontFamily: "Montserrat, sans-serif" }}>Supprimer</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100">
                <div className="flex justify-between mb-4">
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>Total</span>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#0B3D91" }}>{cartTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  className="block w-full text-center text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity">
                  Passer commande →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && !orderResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setCheckoutOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1c2340", marginBottom: 16 }}>Finaliser la commande</h2>
            <form onSubmit={submitOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nom" value={checkoutForm.nom} onChange={e => setCheckoutForm({ ...checkoutForm, nom: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                <input required placeholder="Prénom" value={checkoutForm.prenom} onChange={e => setCheckoutForm({ ...checkoutForm, prenom: e.target.value })} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </div>
              <input required placeholder="Téléphone" value={checkoutForm.telephone} onChange={e => setCheckoutForm({ ...checkoutForm, telephone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              <input type="email" placeholder="Email (optionnel)" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              <div>
                <label style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }} className="block mb-1.5">Mode de paiement</label>
                <select value={checkoutForm.payment_method} onChange={e => setCheckoutForm({ ...checkoutForm, payment_method: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm">
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn_momo">MTN MoMo</option>
                  <option value="especes">Espèces (au secrétariat)</option>
                </select>
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
              <div className="flex justify-between items-center pt-2">
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280" }}>Total</span>
                <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#0B3D91" }}>{cartTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <button type="submit" style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }} className="w-full text-white py-3 rounded-xl hover:opacity-90 transition-opacity">
                Confirmer la commande
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order confirmation */}
      {orderResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1c2340" }}>Commande {orderResult.order.order_number}</h2>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "#6b7280", marginTop: 8 }}>
              Total : <strong>{orderResult.order.total.toLocaleString("fr-FR")} FCFA</strong>
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mt-5 text-left">
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.83rem", color: "#374151", lineHeight: 1.7 }}>{orderResult.payment.instructions}</p>
            </div>
            <button onClick={() => { setOrderResult(null); setCheckoutOpen(false); }}
              style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.83rem" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-6 hover:opacity-90 transition-opacity">
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
