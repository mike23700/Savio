import { Fragment, useEffect, useState } from "react";
import { apiGet, apiPatch, localDateISO } from "@/lib/api";
import { ESPACE_KIND, RESERVATION_STATUT, formatFcfa, formatShortDate, type Reservation } from "@/lib/content-types";
import Icon from "@/components/Icon";

const PAYMENT_LABEL: Record<string, string> = { orange_money: "Orange Money", mtn_momo: "MTN MoMo", especes: "Espèces" };
const PAYMENT_STATUS_LABEL: Record<string, string> = { en_attente: "en attente", paye: "payé", echoue: "échoué", annule: "annulé" };
const STATUS_COLOR: Record<string, string> = { paye: "#16a34a", echoue: "#dc2626", annule: "#6b7280", en_attente: "#D4AF37" };

type Filter = "" | "chambre" | "salle";

export default function AdminReservations() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<Filter>("");
  const [showPast, setShowPast] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  function load() {
    apiGet<Reservation[]>(`/admin/reservations${filter ? `?kind=${filter}` : ""}`).then(setRows);
  }

  useEffect(load, [filter]);

  async function patch(id: number, body: Record<string, unknown>) {
    await apiPatch(`/admin/reservations/${id}`, body);
    load();
  }

  const today = localDateISO();
  const visible = rows.filter((r) => showPast || r.date_fin.slice(0, 10) >= today);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Réservations</h1>
        <div className="flex items-center gap-3" style={{ fontSize: "0.82rem" }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} style={selectStyle}>
            <option value="">Chambres et salles</option>
            <option value="chambre">Chambres uniquement</option>
            <option value="salle">Salles uniquement</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} /> Afficher les dates passées
          </label>
        </div>
      </div>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Réf.</th><th style={th}>Espace</th><th style={th}>Dates</th><th style={th}>Client</th><th style={th}>Montant / paiement</th><th style={th}>Statut</th><th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr><td colSpan={7} style={{ ...td, color: "#9ca3af", fontSize: "0.85rem" }}>Aucune réservation.</td></tr>
          )}
          {visible.map((r) => {
            const kind = r.espace?.kind ?? "chambre";
            return (
              <Fragment key={r.id}>
                <tr style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.82rem", opacity: r.statut === "annulee" ? 0.55 : 1 }}>
                  <td style={td}>{r.reference}<br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{formatShortDate(r.created_at)}</span></td>
                  <td style={td}>
                    {r.espace?.nom}
                    <br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>
                      {kind === "chambre" ? "Chambre" : "Salle"}{r.nb_unites > 1 ? ` × ${r.nb_unites}` : ""}{r.nb_personnes ? ` · ${r.nb_personnes} pers.` : ""}
                    </span>
                  </td>
                  <td style={td}>
                    {formatShortDate(r.date_debut)}
                    {(kind === "chambre" || r.date_fin.slice(0, 10) !== r.date_debut.slice(0, 10)) && <><br /><Icon name="arrowRight" size={12} strokeWidth={1.75} /> {formatShortDate(r.date_fin)}</>}
                    {kind === "chambre" && <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>arrivée <Icon name="arrowRight" size={12} strokeWidth={1.75} /> départ</span></>}
                  </td>
                  <td style={td}>
                    {r.prenom} {r.nom}<br />
                    <span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{r.telephone}{r.email ? ` · ${r.email}` : ""}</span>
                  </td>
                  <td style={td}>
                    {r.montant ? formatFcfa(r.montant) : <span style={{ color: "#9ca3af" }}>Sur devis</span>}
                    {r.payment_method && (
                      <>
                        <br />{PAYMENT_LABEL[r.payment_method]} ·{" "}
                        <span style={{ color: STATUS_COLOR[r.payment_status], fontWeight: 700 }}>{PAYMENT_STATUS_LABEL[r.payment_status]}</span>
                      </>
                    )}
                    {r.payment_provider === "peex" && (
                      <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>Peex · {r.payment_provider_status ?? "—"} · {r.payment_reference}</span></>
                    )}
                  </td>
                  <td style={td}>
                    <select value={r.statut} onChange={(e) => patch(r.id, { statut: e.target.value })} style={selectStyle}>
                      {Object.entries(RESERVATION_STATUT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    {r.montant !== null && r.payment_status !== "paye" && r.statut !== "annulee" && (
                      <button onClick={() => patch(r.id, { payment_status: "paye" })} style={{ ...linkBtn, color: "#16a34a", fontWeight: 700 }}>Marquer payé</button>
                    )}
                    <button onClick={() => { setOpenId(openId === r.id ? null : r.id); setNotes(r.admin_notes || ""); }} style={linkBtn}>
                      {openId === r.id ? "Fermer" : "Détails"}
                    </button>
                  </td>
                </tr>
                {openId === r.id && (
                  <tr style={{ background: "#FAFBFD", fontSize: "0.82rem" }}>
                    <td colSpan={7} style={{ ...td, paddingTop: 4 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          {r.evenement && <p><strong>Événement :</strong> {r.evenement}</p>}
                          <p style={{ whiteSpace: "pre-line", marginTop: 4 }}><strong>Message :</strong> {r.message || "—"}</p>
                          <p style={{ marginTop: 4, color: "#6b7280" }}>Tarif : {ESPACE_KIND[kind].unit === "nuit" ? "à la nuit" : "à la journée"}</p>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }}>Notes internes (devis envoyé, caution, clés…)</label>
                          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...selectStyle, width: "100%" }} />
                          <button onClick={() => patch(r.id, { admin_notes: notes })} style={{ ...linkBtn, marginTop: 4, fontWeight: 700 }}>Enregistrer la note</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: "0.8rem" };
const th: React.CSSProperties = { padding: "10px 14px" };
const td: React.CSSProperties = { padding: "10px 14px", verticalAlign: "top" };
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.78rem", marginRight: 10, padding: 0 };
