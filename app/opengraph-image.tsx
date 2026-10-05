import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0D12",
          color: "#EDEBE6",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#A3A19B", letterSpacing: 4 }}>
          <span>{site.agency.toUpperCase()}</span>
          <span>{site.location.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: -8, lineHeight: 1 }}>
            {site.wordmark.slice(0, -1)}
            <span style={{ color: "#C6FF3D" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 28, maxWidth: 900, lineHeight: 1.2 }}>{site.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {site.roles.map((r) => (
            <div key={r} style={{ display: "flex", border: "2px solid #232733", borderRadius: 999, padding: "10px 22px", fontSize: 24 }}>
              {r}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
