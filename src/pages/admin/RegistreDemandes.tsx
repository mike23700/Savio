import { Fragment, useEffect, useState } from "react";
import { apiGet, apiPatch, downloadFile } from "@/lib/api";
import {
  PRINT_STATUT_LABELS,
  SACREMENT_LABELS,
  formatIsoDate,
  type RegistrePrintRequest,
  type RegistrePrintStatut,
} from "@/lib/sacrements";
import Icon from "@/components/Icon";

const STATUTS: RegistrePrintStatut[] = ["en_attente", "en_traitement", "prete", "livree", "refusee"];

const STATUT_COLOR: Record<RegistrePrintStatut, string> = {
  en_attente: "#D4AF37",
  en_traitement: "#2563eb",
  prete: "#16a34a",
  livree: "#3730a3",
  refusee: "#dc2626",
};

const PARISH_PHONE = "Saint Dominique Savio";

/** Normalise a Cameroonian phone number (9 digits) to an international wa.me number. */
function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("237")) return digits;
  if (digits.length === 9) return `237${digits}`;
  return digits;
}

/**
 * Printing requests for the parish register. The office opens the PDF, prints
 * it, then sends the fiche to the member by email or WhatsApp and marks the
 * request as handled.
 */
export default function AdminRegistreDemandes() {
  const [rows, setRows] = useState<RegistrePrintRequest[]>([]);
  const [filter, setFilter] = useState<"" | RegistrePrintStatut>("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  function load(statut: "" | RegistrePrintStatut = filter) {
    setLoading(true);
    apiGet<RegistrePrintRequest[]>(`/admin/registre-demandes${statut ? `?statut=${statut}` : ""}`)
      .then(setRows)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(filter); }, [filter]);

  async function patch(id: number, body: Record<string, unknown>) {
    await apiPatch(`/admin/registre-demandes/${id}`, body);
    load();
  }

  async function download(r: RegistrePrintRequest) {
    setBusyId(r.id);
    try {
      const inscription = r.inscription;
      const name = inscription ? `${inscription.nom}-${inscription.prenom}`.replace(/\s+/g, "-") : r.reference;
      await downloadFile(`/admin/registre-demandes/${r.id}/pdf`, `fiche-${name}.pdf`);
      load();
    } finally {
      setBusyId(null);
    }
  }

  function mailLink(r: RegistrePrintRequest): string {
    const email = r.inscription?.email || r.user?.email || "";
    const subject = `Fiche du registre paroissial - ${r.inscription?.prenom ?? ""} ${r.inscription?.nom ?? ""}`.trim();
    const body = [
      `Bonjour ${r.inscription?.prenom ?? ""},`,
      "",
      "Votre fiche du registre paroissial est prête. Vous la trouverez en pièce jointe (PDF).",
      "",
      `${PARISH_PHONE} — Secrétariat paroissial`,
    ].join("\n");
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function whatsappLink(r: RegistrePrintRequest): string {
    const phone = r.inscription?.telephone || "";
    const message = [
      `Bonjour ${r.inscription?.prenom ?? ""},`,
      "votre fiche du registre paroissial est prête (PDF).",
      "Secrétariat paroissial — Saint Dominique Savio",
    ].join(" ");
    return `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340" }}>Demandes d'impression</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value as "" | RegistrePrintStatut)} style={selectStyle}>
          <option value="">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s} value={s}>{PRINT_STATUT_LABELS[s]}</option>)}
        </select>
      </div>

      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.82rem", color: "#6b7280", marginBottom: 16, lineHeight: 1.7 }}>
        Téléchargez le PDF, imprimez-le, puis transmettez la fiche au fidèle par email ou WhatsApp. Joignez le PDF manuellement au message.
      </p>

      <table style={{ width: "100%", background: "#fff", borderRadius: 12, overflow: "hidden", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F5F7FA", textAlign: "left", fontSize: "0.75rem", color: "#6b7280" }}>
            <th style={th}>Réf.</th><th style={th}>Fidèle</th><th style={th}>Contact</th><th style={th}>Message</th><th style={th}>Statut</th><th style={th}>Transmettre</th>
          </tr>
        </thead>
        <tbody>
          {!loading && rows.length === 0 && (
            <tr><td colSpan={6} style={{ ...td, color: "#9ca3af", fontSize: "0.85rem" }}>Aucune demande.</td></tr>
          )}
          {rows.map((r) => {
            const ins = r.inscription;
            const email = ins?.email || r.user?.email || "";
            const phone = ins?.telephone || "";
            const canMail = !!email;
            const canWa = phone.replace(/\D/g, "").length >= 8;
            return (
              <Fragment key={r.id}>
                <tr style={{ borderTop: "1px solid #f1f5f9", fontSize: "0.82rem", opacity: r.statut === "refusee" ? 0.6 : 1 }}>
                  <td style={td}>
                    {r.reference}<br />
                    <span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</span>
                  </td>
                  <td style={td}>
                    {ins ? `${ins.prenom} ${ins.nom}` : "—"}
                    {r.user && <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>Compte : {r.user.prenom} {r.user.nom}</span></>}
                  </td>
                  <td style={td}>
                    {phone || "—"}
                    {email && <><br /><span style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{email}</span></>}
                  </td>
                  <td style={{ ...td, maxWidth: 220 }}>
                    {r.message ? <span style={{ whiteSpace: "pre-line" }}>{r.message}</span> : <span style={{ color: "#9ca3af" }}>—</span>}
                  </td>
                  <td style={td}>
                    <select value={r.statut} onChange={(e) => patch(r.id, { statut: e.target.value })} style={{ ...selectStyle, color: STATUT_COLOR[r.statut], fontWeight: 700 }}>
                      {STATUTS.map((s) => <option key={s} value={s}>{PRINT_STATUT_LABELS[s]}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <button onClick={() => download(r)} disabled={busyId === r.id}
                      style={{ ...linkBtn, fontWeight: 700, opacity: busyId === r.id ? 0.5 : 1 }}>
                      <Icon name="download" size={14} strokeWidth={1.75} /> PDF
                    </button>
                    <a href={canMail ? mailLink(r) : undefined} aria-disabled={!canMail}
                      style={{ ...linkBtn, color: canMail ? "#0B3D91" : "#9ca3af", pointerEvents: canMail ? "auto" : "none" }}>
                      <Icon name="mail" size={14} strokeWidth={1.75} /> Email
                    </a>
                    <a href={canWa ? whatsappLink(r) : undefined} target="_blank" rel="noreferrer" aria-disabled={!canWa}
                      style={{ ...linkBtn, color: canWa ? "#25D366" : "#9ca3af", pointerEvents: canWa ? "auto" : "none" }}>
                      <Icon name="whatsapp" size={14} strokeWidth={1.75} /> WhatsApp
                    </a>
                    <button onClick={() => { setOpenId(openId === r.id ? null : r.id); setNotes(r.admin_notes || ""); }} style={linkBtn}>
                      {openId === r.id ? "Fermer" : "Détails"}
                    </button>
                  </td>
                </tr>
                {openId === r.id && (
                  <tr style={{ background: "#FAFBFD", fontSize: "0.82rem" }}>
                    <td colSpan={6} style={{ ...td, paddingTop: 4 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <p><strong>Fiche :</strong> {ins ? `${ins.prenom} ${ins.nom}` : "—"}{ins?.quartier ? ` · ${ins.quartier}` : ""}</p>
                          {ins && ins.sacrements.length > 0 ? (
                            <p style={{ marginTop: 4 }}>
                              <strong>Sacrements : </strong>
                              {ins.sacrements.map(s => `${SACREMENT_LABELS[s.type]}${s.numero_registre ? ` (n° ${s.numero_registre})` : ""}`).join(", ")}
                            </p>
                          ) : (
                            <p style={{ marginTop: 4, color: "#9ca3af" }}>Aucun sacrement enregistré.</p>
                          )}
                          {ins?.created_at && (
                            <p style={{ marginTop: 4, color: "#6b7280" }}>Inscrit le {formatIsoDate(ins.created_at)}</p>
                          )}
                          {ins && (
                            <button onClick={() => downloadFile(`/admin/registre/${ins.id}/pdf`, `fiche-${ins.nom}-${ins.prenom}.pdf`).catch(() => {})}
                              style={{ ...linkBtn, marginTop: 6, fontWeight: 700 }}>
                              <Icon name="fileText" size={14} strokeWidth={1.75} /> PDF de la fiche
                            </button>
                          )}
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }}>Notes internes (impression, envoi effectué…)</label>
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
const linkBtn: React.CSSProperties = { background: "none", border: "none", color: "#0B3D91", cursor: "pointer", fontSize: "0.78rem", marginRight: 10, padding: 0, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 };
