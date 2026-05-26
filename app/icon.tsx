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
          background: "linear-gradient(135deg, #0C0A08 0%, #161310 100%)",
          color: "#C9A55C",
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
