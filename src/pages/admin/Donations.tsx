import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface Donation {
  id: number;
  montant: number;
  payment_method: string;
  payment_status: string;
  intention: string | null;
  created_at: string;
  user: { nom: string; prenom: string; email: string } | null;
}

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
            <th style={th}>Donateur</th><th style={th}>Montant</th><th style={th}>Intention</th><th style={th}>Paiement</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.85rem" }}>
              <td style={td}>{d.user ? `${d.user.prenom} ${d.user.nom}` : "—"}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{d.user?.email}</span></td>
              <td style={td}>{d.montant.toLocaleString("fr-FR")} FCFA</td>
              <td style={td}>{d.intention || "—"}</td>
              <td style={td}>
                {d.payment_method}<br />
                <span style={{ color: d.payment_status === "paye" ? "#16a34a" : "#D4AF37", fontWeight: 700 }}>{d.payment_status}</span>
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
