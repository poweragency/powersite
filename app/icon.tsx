import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          backgroundImage: "linear-gradient(135deg, #0B1220 0%, #131C2E 100%)",
          color: "#D4AF6A",
          fontFamily: "serif",
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: -2,
          fontStyle: "italic",
        }}
      >
        PL
      </div>
    ),
    { ...size },
  );
}
