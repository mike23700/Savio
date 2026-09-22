import { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";

const FIELDS: { key: string; label: string }[] = [
  { key: "parish.name", label: "Nom de la paroisse" },
  { key: "parish.short_name", label: "Nom court" },
  { key: "parish.location", label: "Localisation" },
  { key: "parish.address", label: "Adresse" },
  { key: "parish.phone", label: "Téléphone" },
  { key: "parish.whatsapp_number", label: "Numéro WhatsApp (format 237XXXXXXXXX)" },
  { key: "parish.email", label: "Email" },
  { key: "parish.hours", label: "Horaires du secrétariat" },
  { key: "parish.founded", label: "Date de fondation" },
  { key: "parish.diocese", label: "Archidiocèse" },
  { key: "parish.deanery", label: "Doyenné" },
  { key: "parish.tagline", label: "Slogan" },
  { key: "parish.maps_url", label: "Lien Google Maps" },
  { key: "social.facebook_url", label: "Lien Facebook" },
  { key: "social.youtube_url", label: "Lien chaîne YouTube" },
  { key: "social.instagram_url", label: "Lien Instagram" },
];

export default function Settings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiGet<Record<string, string>>("/settings")
      .then(setValues)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await apiPut<Record<string, string>>("/admin/settings", { settings: values });
      setValues(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6rem", color: "#1c2340", marginBottom: 24 }}>
        Paramètres de la paroisse
      </h1>
      <form onSubmit={handleSubmit}>
        {FIELDS.map((f) => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#6b7280", marginBottom: 6 }}>{f.label}</label>
            <input
              value={values[f.key] || ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          </div>
        ))}
        {saved && (
          <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 12px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 }}>
            Paramètres enregistrés.
          </div>
        )}
        <button
          type="submit"
          disabled={saving}
          style={{ background: "#0B3D91", color: "#fff", padding: "12px 24px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
