import { useRef, useState } from "react";
import { apiFormData, mediaUrl, ApiError } from "@/lib/api";

type Folder = "news" | "team" | "homelies" | "products" | "projets" | "sacrements" | "media" | "misc";

/**
 * Admin image field: shows the current image as a preview and lets the admin
 * import a file from their computer. The file is uploaded right away to
 * /admin/uploads/image and the returned storage path ("news/abc.jpg") is
 * handed to `onChange`, so the parent form simply saves that string.
 */
export default function ImageUpload({
  label = "Image",
  value,
  onChange,
  folder,
  height = 140,
}: {
  label?: string;
  value: string | null | undefined;
  onChange: (path: string) => void;
  folder: Folder;
  height?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const src = mediaUrl(value);

  async function upload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await apiFormData<{ path: string }>("/admin/uploads/image", fd, "POST");
      onChange(res.path);
    } catch (e) {
      setError(e instanceof ApiError ? e.errors?.file?.[0] || e.message : "Échec de l'import.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          onClick={() => input.current?.click()}
          style={{
            width: height * 1.4, height, borderRadius: 8, overflow: "hidden", flexShrink: 0, cursor: "pointer",
            background: "#F5F7FA", border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {src ? (
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Aucune image</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button type="button" disabled={uploading} onClick={() => input.current?.click()}
            style={{ background: "#0B3D91", color: "#fff", padding: "6px 14px", borderRadius: 6, border: "none", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", opacity: uploading ? 0.6 : 1 }}>
            {uploading ? "Import en cours…" : src ? "Changer l'image" : "Importer une image"}
          </button>
          {src && (
            <button type="button" onClick={() => onChange("")}
              style={{ background: "none", color: "#b91c1c", padding: "4px 0", border: "none", fontSize: "0.78rem", cursor: "pointer", textAlign: "left" }}>
              Retirer l'image
            </button>
          )}
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>JPG, PNG ou WebP · 5 Mo max</span>
          {error && <span style={{ fontSize: "0.72rem", color: "#b91c1c" }}>{error}</span>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
    </div>
  );
}

/** Small thumbnail for admin tables. */
export function Thumb({ path, size = 44 }: { path: string | null | undefined; size?: number }) {
  const src = mediaUrl(path);
  return src ? (
    <img src={src} alt="" style={{ width: size * 1.3, height: size, objectFit: "cover", borderRadius: 6, display: "block" }} />
  ) : (
    <div style={{ width: size * 1.3, height: size, borderRadius: 6, background: "#F5F7FA" }} />
  );
}
