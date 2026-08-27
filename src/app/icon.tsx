import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#101811", background: "#b9d7ba", border: "6px solid #18231b", fontFamily: "monospace", fontSize: 25, fontWeight: 800 }}>G64</div>,
    size,
  );
}

