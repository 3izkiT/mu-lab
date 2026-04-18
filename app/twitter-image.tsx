import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 18% 25%, rgba(247,231,206,0.16) 0%, transparent 42%), radial-gradient(circle at 78% 38%, rgba(163,175,255,0.26) 0%, transparent 48%), linear-gradient(180deg, #050818 0%, #02040f 100%)",
          color: "#eef1ff",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, color: "rgba(247,231,206,0.95)", letterSpacing: 0.5 }}>Mu-Lab</div>
          <div style={{ fontSize: 14, color: "rgba(219,225,255,0.7)" }}>mu-lab.app</div>
        </div>

        <div>
          <div style={{ fontSize: 54, lineHeight: 1.06, fontWeight: 650, letterSpacing: -0.9 }}>
            Daily Horoscope
            <span style={{ color: "rgba(247,231,206,0.95)" }}> · </span>
            Tarot
          </div>
          <div style={{ marginTop: 16, fontSize: 24, color: "rgba(219,225,255,0.78)" }}>
            Free daily content to start — unlock deeper insights when you’re ready.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(247,231,206,0.25)",
              background: "rgba(247,231,206,0.06)",
              color: "rgba(247,231,206,0.9)",
              fontSize: 14,
            }}
          >
            th-TH
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(219,225,255,0.2)",
              background: "rgba(219,225,255,0.06)",
              color: "rgba(219,225,255,0.85)",
              fontSize: 14,
            }}
          >
            mobile-first UX
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

