import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG image — ใช้ฟอนต์ Prompt subset ไทยจากไฟล์ใน repo
 * (next/og default ไม่มี glyph ไทย ทำให้ภาพออกมา 0 bytes/ขาวเปล่า — ต้องส่ง fonts เอง)
 */
async function loadFont(file: string): Promise<ArrayBuffer> {
  const url = new URL(`./_fonts/${file}`, import.meta.url);
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function OpenGraphImage() {
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
            "radial-gradient(circle at 20% 25%, rgba(247,231,206,0.18) 0%, transparent 40%), radial-gradient(circle at 70% 35%, rgba(104,118,218,0.28) 0%, transparent 45%), linear-gradient(180deg, #050818 0%, #02040f 100%)",
          color: "#eef1ff",
          fontFamily: "Prompt",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(247,231,206,0.85) 0%, rgba(234,210,166,0.55) 55%, rgba(217,187,133,0.35) 100%)",
              boxShadow: "0 0 35px rgba(247,231,206,0.25)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 0.5, color: "rgba(247,231,206,0.95)", fontWeight: 700 }}>
              Mu-Lab
            </div>
            <div style={{ fontSize: 14, color: "rgba(219,225,255,0.65)" }}>
              Cosmic intelligence for practical decisions.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, lineHeight: 1.06, fontWeight: 700, letterSpacing: -0.8 }}>
            ดูดวงรายวัน · ไพ่ยิปซี · วิเคราะห์ส่วนตัว
          </div>
          <div style={{ marginTop: 20, fontSize: 24, color: "rgba(219,225,255,0.78)", maxWidth: 920 }}>
            บทความรายวัน (ฟรี) + ประสบการณ์ไพ่ยิปซีแบบ freemium และแพ็กเกจเจาะลึกสำหรับคนที่อยากตัดสินใจให้แม่นขึ้น
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["daily-horoscope", "tarot", "premium insight"].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid rgba(247,231,206,0.25)",
                background: "rgba(247,231,206,0.06)",
                color: "rgba(247,231,206,0.9)",
                fontSize: 15,
                letterSpacing: 0.2,
                fontWeight: 500,
              }}
            >
              {t}
            </div>
          ))}
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
