import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface Donation {
  id: number;
  montant: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string | null;
  payment_provider: string | null;
  payment_provider_status: string | null;
  intention: string | null;
  projet: { id: number; titre: string } | null;
  created_at: string;
  user: { nom: string; prenom: string; email: string } | null;
}

const STATUS_COLOR: Record<string, string> = { paye: "#16a34a", echoue: "#dc2626", annule: "#6b7280", en_attente: "#D4AF37" };

export default function AdminDonations() {
  const [rows, setRows] = useState<Donation[]>([]);

  function load() {
    apiGet<Donation[]>("/admin/donations").then(setRows);
  }

  useEffect(load, []);

  async function markPaid(id: number) {
    await apiPatch(`/admin/donations/${id}`, { payment_status: "paye" });
    load();
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 24 }}>Dons</h1>
      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Donateur</th><th style={th}>Montant</th><th style={th}>Projet / intention</th><th style={th}>Paiement</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{d.user ? `${d.user.prenom} ${d.user.nom}` : "—"}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{d.user?.email}</span></td>
              <td style={td}>{d.montant.toLocaleString("fr-FR")} FCFA</td>
              <td style={td}>{d.projet && <strong>{d.projet.titre}<br /></strong>}{d.intention || (d.projet ? "" : "—")}</td>
              <td style={td}>
                {d.payment_method}<br />
                <span style={{ color: STATUS_COLOR[d.payment_status] ?? "#D4AF37", fontWeight: 700 }}>{d.payment_status}</span>
                {d.payment_provider === "peex" && (
                  <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>Peex · {d.payment_provider_status ?? "—"} · {d.payment_reference}</span></>
                )}
              </td>
              <td style={td}>
                {d.payment_status !== "paye" && (
                  <button onClick={() => markPaid(d.id)} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
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
