import { ImageResponse } from "next/og";

export const alt = "Gareth64 — Gareth Beall, Lead AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: 56, color: "#e8e2cf", background: "#0a0e0c", fontFamily: "monospace" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #4f5c50", padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6 }}>
          <span>GARETH64</span><span style={{ color: "#9befa7" }}>READY.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#9befa7", fontSize: 22, letterSpacing: 3 }}>CLINICAL JUDGMENT × PRODUCTION AI</span>
          <span style={{ marginTop: 18, fontFamily: "serif", fontSize: 104, letterSpacing: -5 }}>Gareth Beall</span>
          <span style={{ marginTop: 4, fontSize: 32 }}>Lead AI/ML Engineer</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["GARETH.AI", "IRIS", "PRODUCTS", "LAB", "CONTACT"].map((label, index) => (
            <span key={label} style={{ padding: "11px 16px", color: "#111813", background: ["#b9d7ba", "#efc46a", "#d78f75", "#92b6c6", "#d7cedf"][index], fontSize: 17 }}>{label}</span>
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}

