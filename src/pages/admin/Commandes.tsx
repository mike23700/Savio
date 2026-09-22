import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface Item {
  id: number;
  product_nom_snapshot: string;
  qty: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  nom: string;
  prenom: string;
  telephone: string;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  items: Item[];
  created_at: string;
}

const PAYMENT_LABEL: Record<string, string> = { orange_money: "Orange Money", mtn_momo: "MTN MoMo", especes: "Espèces" };

export default function AdminCommandes() {
  const [rows, setRows] = useState<Order[]>([]);

  function load() {
    apiGet<Order[]>("/admin/orders").then(setRows);
  }

  useEffect(load, []);

  async function markPaid(id: number) {
    await apiPatch(`/admin/orders/${id}`, { payment_status: "paye" });
    load();
  }

  async function updateOrderStatus(id: number, order_status: string) {
    await apiPatch(`/admin/orders/${id}`, { order_status });
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 24 }}>Commandes boutique</h1>
      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Commande</th><th style={th}>Client</th><th style={th}>Articles</th><th style={th}>Total</th><th style={th}>Paiement</th><th style={th}>Statut</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.82rem" }}>
              <td style={td}>{o.order_number}</td>
              <td style={td}>{o.prenom} {o.nom}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{o.telephone}</span></td>
              <td style={td}>{o.items.map((i) => `${i.product_nom_snapshot} x${i.qty}`).join(", ")}</td>
              <td style={td}>{o.total.toLocaleString("fr-FR")} FCFA</td>
              <td style={td}>
                {PAYMENT_LABEL[o.payment_method]}<br />
                <span style={{ color: o.payment_status === "paye" ? "#16a34a" : "#D4AF37", fontWeight: 700 }}>{o.payment_status}</span>
              </td>
              <td style={td}>
                <select value={o.order_status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: "0.78rem" }}>
                  <option value="en_attente">En attente</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="preparee">Préparée</option>
                  <option value="livree">Livrée</option>
                  <option value="annulee">Annulée</option>
                </select>
              </td>
              <td style={td}>
                {o.payment_status !== "paye" && (
                  <button onClick={() => markPaid(o.id)} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
                    Marquer payé
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px" };
