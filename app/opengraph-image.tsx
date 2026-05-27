import { ImageResponse } from "next/og";

export const alt = "PowerLanding — Atelier digitale. Sito su misura in 48h.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 70,
          backgroundColor: "#0B1220",
          backgroundImage:
            "radial-gradient(ellipse 800px 500px at 100% 0%, rgba(212,175,106,0.16) 0%, transparent 60%), radial-gradient(ellipse 600px 400px at 0% 100%, rgba(91,127,166,0.14) 0%, transparent 60%)",
          color: "#EAF0F7",
          fontFamily: "serif",
        }}
      >
        {/* Top: PL mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 110,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(212,175,106,0.5)",
              borderRadius: 24,
              background: "rgba(19,28,46,0.6)",
              color: "#D4AF6A",
              fontSize: 64,
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: -3,
            }}
          >
            PL
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 6,
                color: "#D4AF6A",
                fontFamily: "sans-serif",
              }}
            >
              Power Agency
            </div>
            <div style={{ fontSize: 28, color: "#8A97AB", fontStyle: "italic" }}>
              PowerLanding · atelier digitale
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#F5F8FC",
              letterSpacing: -3,
            }}
          >
            Sito su misura.
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#D4AF6A",
              fontStyle: "italic",
              letterSpacing: -3,
            }}
          >
            Consegnato in 48 ore.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#8A97AB",
            fontFamily: "sans-serif",
            borderTop: "1px solid rgba(234,240,247,0.1)",
            paddingTop: 24,
          }}
        >
          <div>poweragency.it</div>
          <div style={{ display: "flex", gap: 32, textTransform: "uppercase", letterSpacing: 3, fontSize: 14 }}>
            <span>Atelier</span>
            <span style={{ color: "#525E70" }}>·</span>
            <span>Su misura</span>
            <span style={{ color: "#525E70" }}>·</span>
            <span>48 ore</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
