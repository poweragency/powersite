import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1220",
          backgroundImage: "linear-gradient(135deg, #0B1220 0%, #131C2E 60%, #1C2840 100%)",
          color: "#D4AF6A",
          fontFamily: "serif",
          fontWeight: 700,
          fontSize: 110,
          letterSpacing: -6,
          fontStyle: "italic",
        }}
      >
        PL
      </div>
    ),
    { ...size },
  );
}
