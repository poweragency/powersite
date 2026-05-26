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
          backgroundColor: "#0C0A08",
          backgroundImage: "linear-gradient(135deg, #0C0A08 0%, #161310 60%, #1E1813 100%)",
          color: "#C9A55C",
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
