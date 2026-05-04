import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = new URL(`./_fonts/${file}`, import.meta.url);
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function TwitterImage() {
  const [medium, bold] = await Promise.all([loadFont("Prompt-Medium.ttf"), loadFont("Prompt-Bold.ttf")]);

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
          fontFamily: "Prompt",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, color: "rgba(247,231,206,0.95)", letterSpacing: 0.5, fontWeight: 700 }}>
            Mu-Lab
          </div>
          <div style={{ fontSize: 14, color: "rgba(219,225,255,0.7)" }}>mu-lab.app</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, lineHeight: 1.06, fontWeight: 700, letterSpacing: -0.9 }}>
            ดูดวงรายวัน · ไพ่ยิปซี
          </div>
          <div style={{ marginTop: 18, fontSize: 24, color: "rgba(219,225,255,0.78)" }}>
            อ่านฟรีทุกวัน — ปลดล็อกบทอ่านเชิงลึกเมื่อพร้อม
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(247,231,206,0.25)",
              background: "rgba(247,231,206,0.06)",
              color: "rgba(247,231,206,0.9)",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            th-TH
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(219,225,255,0.2)",
              background: "rgba(219,225,255,0.06)",
              color: "rgba(219,225,255,0.85)",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            mobile-first UX
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Prompt", data: medium, weight: 500, style: "normal" },
        { name: "Prompt", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
