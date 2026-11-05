/**
 * Shop cart kept in the visitor's browser so the product page (/boutique/:slug)
 * and the shop (/boutique) share it. Storage can be unavailable (private mode,
 * blocked site data): every access is wrapped and falls back to an empty cart.
 */
export type CartItem = { id: number; qty: number }

const KEY = "savio.cart"

export function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter(
          (c): c is CartItem =>
            typeof c?.id === "number" && typeof c?.qty === "number" && c.qty > 0,
        )
      : []
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cart))
  } catch {
    // ignore storage errors
  }
}

export function addToStoredCart(id: number, qty = 1): CartItem[] {
  const cart = loadCart()
  const existing = cart.find((c) => c.id === id)
  const next = existing
    ? cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c))
    : [...cart, { id, qty }]
  saveCart(next)
  return next
}
