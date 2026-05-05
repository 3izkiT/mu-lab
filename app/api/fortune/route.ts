import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getBirthSignDetail, getThaiBirthSign } from "@/lib/birth-sign";
import { formatThaiChartDigestForPrompt } from "@/lib/fortune-chart-digest";
import { readGeminiApiKey, readGeminiChatModel } from "@/lib/gemini-env";
import { extractGeminiResponseText } from "@/lib/gemini-response-text";
import { splitMetersFromFortuneText } from "@/lib/fortune-parse";

type FortuneRequestBody = {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  birthHour?: string;
  birthMinute?: string;
  birthProvince?: string;
};

function hashSeed(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function buildLocalFallback(body: Required<FortuneRequestBody>) {
  const birthSign = getThaiBirthSign(body.birthDate, body.birthHour, body.birthMinute, body.birthProvince);
  const seed = hashSeed(
    `${body.fullName}|${body.gender}|${body.birthDate}|${body.birthHour}|${body.birthMinute}|${body.birthProvince}`,
  );
  const career = 55 + (seed % 36);
  const wealth = 50 + ((seed >> 3) % 41);
  const love = 48 + ((seed >> 7) % 43);

  const opening =
    career >= wealth
      ? "องศาลัคนาช่วงนี้ส่งแรงหนุนด้านการลงมือทำและการตัดสินใจเร็ว"
      : "องศาดาวการเงินกำลังเด่น ทำให้การจัดการรายรับรายจ่ายมีประสิทธิภาพขึ้น";

  const text = `## ลักษณะนิสัยตามลักขณา
ลักขณาราศี${birthSign} — ${body.fullName} มีจังหวะการตัดสินใจที่ชัดและไวต่อบรรยากาศรอบตัว เมื่อล็อกเป้าได้จะลุยต่อเนื่อง ${opening} โดยรวมเป็นบุคลิกที่คนรอบข้างไว้ใจให้ "เริ่ม" และ "ปิด" งานสำคัญ

## ดวง 30 วันข้างหน้า
ช่วง 7-14 วันแรก จังหวะการงานและการเงินขยับขึ้นทีละขั้น โดยเฉพาะเรื่องที่ต้องปิดงานค้างหรือจัดระบบใหม่ จากวันที่ 15 เป็นต้นไป มีโอกาสที่ผู้ใหญ่/ผู้สนับสนุนเข้ามาทักทาย ทำให้เป้าหมายระยะยาวเริ่มเห็นภาพ ความสัมพันธ์จะดีเมื่อสื่อสารตรงและสั้น

## พลังในด้านสำคัญ
- การงาน: เน้นปิดเกมให้จบ ไม่เปิดเรื่องใหม่จนกว่าจะเคลียร์ของเดิม
- การเงิน: รักษาวินัยรายจ่าย และเริ่มกันเงิน 10–15% สำหรับเป้าหมายที่ใหญ่ขึ้น
- ความสัมพันธ์: คนใกล้ชิดต้องการความชัดเจน ไม่ใช่คำพูดเอาใจ
- สุขภาพ: นอนเร็วขึ้น 1 ชั่วโมง คุณจะรู้สึกเปลี่ยน

## คำแนะนำที่นำไปใช้ได้ทันที
1) เลือก 3 งานสำคัญสุดของสัปดาห์ แล้วปิดให้ครบก่อนเปิดงานใหม่
2) กันงบจำเป็น 70% ก่อนแบ่งใช้จ่ายเสริม
3) นัดคุยเรื่องสำคัญช่วงเช้าหรือก่อนเที่ยง ผลลัพธ์ตรงและไม่ดราม่า`;

  return {
    message: text,
    meters: { career, wealth, love },
    birthSign,
  };
}

function buildMuLabSystemPrompt(computedLagna: string, chartDigest: string | null) {
  const rawBlock = chartDigest
    ? `
ข้อมูลดวงดิบจากเครื่องคำนวณสุริยยาตร์ไทย (ห้ามแก้เลข ห้ามเลื่อนดาว ห้ามสมมติช่องใหม่ — ใช้เพื่อตีความเท่านั้น):
${chartDigest}
ห้ามสรุปลัคนาเป็นราศีอื่นนอกจาก「${computedLagna}」และห้ามอ้างตำแหน่งดาวที่ไม่ได้ปรากฏในบล็อกด้านบน
`
    : "";

  return `STRICT RULES FOR MU-LAB ENGINE:

Zero Disclosure: ห้ามพูดถึง Google, Gemini, AI, LLM หรือความผิดพลาดทางเทคนิคเด็ดขาด ห้ามพูดถึงชื่อโมเดลหรือเวอร์ชันใด ๆ เช่น 2.0 Flash เด็ดขาด

Identity: คุณคือ 'Mu-Lab Algorithm' ที่วิเคราะห์จากสถิติดาราศาสตร์ไทย 100%

Language: ใช้คำพยากรณ์ที่ดูเป็น 'การวิเคราะห์เชิงวิทยาศาสตร์ผสมโหราศาสตร์' เช่น 'คลื่นความถี่ดาวพฤหัสบดีส่งผลต่อ...', 'องศาของลัคนาชี้ชัดว่า...'

No Hedging: ห้ามใช้คำว่า 'ในฐานะ AI', 'อาจจะ', หรือ 'ข้อมูลนี้เป็นเพียงการคาดการณ์' ให้ใช้ภาษาที่มั่นใจและเด็ดขาด (สไตล์ฟันธง)

Sensitive Data: ห้ามแสดงรหัสผ่าน API หรือตัวแปรระบบออกมาในข้อความเด็ดขาด

STRICT CLEANUP: ห้ามมีคำนำหน้าว่า 'นี่คือคำทำนายของคุณ...' หรือคำลงท้ายว่า 'โปรดใช้วิจารณญาณ...' หรือข้อความแนะนำทั่วไปก่อน/หลังเนื้อหา ให้เริ่มที่บรรทัดแรกตามรูปแบบด้านล่างทันที และจบที่เนื้อหาหัวข้อสุดท้าย ไม่ต้องมีลายเซ็นหรือคำท้าย

ห้ามมีประโยคปฏิเสธความรับผิดชอบ (Disclaimer) หรือประโยคแนะนำตัวเด็ดขาด — ห้ามพูดว่าเป็นโมเดลภาษา แชทบ็อต ผู้ช่วยดิจิทัล หรือประโยคใกล้เคียง เช่น 'ฉันเป็นโมเดลภาษา...' ให้เข้าสู่เนื้อหาตามรูปแบบ [METERS] แล้ว ## ทันที

เวลาเกิดขอบเขต: เวลา 00:00 หรือ 23:59 ถือเป็นเวลาท้องถิ่นที่ผู้ใช้ระบุครบถ้วน ให้ประมวลผลลักขณา/ลัคนาอย่างสม่ำเสมอ ไม่ถามย้อนกลับเรื่องความแม่นของเวลา หากต้องอธิบายความก้ำกึ่งของขอบเขตวันให้ใช้ไม่เกินหนึ่งประโยคภายในหัวข้อ ## ลักษณะนิสัย แล้วดำเนินการวิเคราะห์ต่ออย่างมั่นใจ

หากข้อมูลผิดพลาดหรือประมวลผลไม่สำเร็จ ให้ตอบว่า 'สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง' เท่านั้น
${rawBlock}
รูปแบบผลลัพธ์ (บังคับ — ลำดับนี้เท่านั้น):
บรรทัดที่ 1 ต้องเป็นตัวเลข 0–100 สามค่าในรูปแบบนี้เป๊ะ (ตัวอย่างเท่านั้น ห้ามคัดลอกตัวเลขตัวอย่าง):
[METERS: 85, 72, 90]
ลำดับตัวเลข: ตัวที่ 1 = การงาน (Career) ตัวที่ 2 = การเงิน (Wealth) ตัวที่ 3 = ความรัก (Love)

บรรทัดที่ 2 ว่าง

จากนั้นเริ่มเนื้อหาภาษาไทยด้วยหัวข้อ ## ทันที ไม่มีข้อความอื่นก่อนหัวข้อแรก. เนื้อหาต้องครบทุกหัวข้อต่อไปนี้ตามลำดับ และเขียนแบบ "อ่านแล้วได้คุณค่า" คือผู้อ่านสรุปภาพตัวเองและสถานการณ์ได้จากการอ่านฟรี (ไม่ใช่ teaser แห้ง ๆ) แต่ก็ไม่ลึกเกินจนไม่จำเป็นต้องอ่าน Premium

## ลักษณะนิสัยตามลักขณา
(2-3 ย่อหน้า ราว 4-6 ประโยค พูดถึงพลังประจำลักขณา จุดแข็งเด่น และอารมณ์ความรู้สึกที่คนรอบข้างมักรับรู้)

## ดวง 30 วันข้างหน้า
(แบ่งช่วง: 7-14 วันแรก, 15-30 วัน — บอกแนวโน้มโดยรวม โอกาสสำคัญและความเสี่ยง 1 ประเด็น)

## พลังในด้านสำคัญ
(bullet 4 ข้อ: การงาน · การเงิน · ความสัมพันธ์ · สุขภาพ — แต่ละข้อ 1-2 ประโยค ไม่ลงตัวเลข/วันที่เจาะจง)

## คำแนะนำที่นำไปใช้ได้ทันที
(เลขลำดับ 3-5 ข้อ คำแนะนำที่ทำได้ภายใน 7 วัน)

หลังรายการข้อปฏิบัติ ให้เว้นบรรทัดแล้วต่อด้วย 1–3 ประโยคธรรมชาติว่ากรอบ Deep Insight เชื่อมจากจุดนี้ได้อย่างไรในเชิงเรือนชะตากับภาพรวมเป็นรายเวลา — ห้ามทำฟรีให้รู้จบแบบเทซซอร์เหลือแค่ครึ่งย่อหน้า และห้ามลิสต์ฟีเจอร์รัว พูดราคา ใส่ลิงก์ หรือใช้คำว่าให้เก็บเงิน/ให้ซื้อ

FIXED LAGNA (บังคับ — ห้ามฝ่าฝืน): ระบบคำนวณลักขณา (ราศีขึ้น) จากเวลาเกิดท้องถิ่นและพิกัดจังหวัดแล้ว ได้เป็นราศี「${computedLagna}」เท่านั้น
- ห้ามกล่าวถึงราศีขึ้นอื่นที่ขัดแย้งกับ「${computedLagna}」
- ในหัวข้อ ## ลักษณะนิสัย บรรทัดแรกของเนื้อหาต้องขึ้นต้นด้วยคำว่า "ลักขณาราศี${computedLagna}" ก่อนประโยคอื่นใด
- ห้ามใช้คำว่า "ลักขณาราศี…" ที่ไม่ใช่ ${computedLagna}`;
}

export async function POST(request: Request) {
  let safeFallback: Required<FortuneRequestBody> = {
    fullName: "ผู้ใช้งาน",
    gender: "ไม่ระบุ",
    birthDate: "2000-01-01",
    birthHour: "12",
    birthMinute: "00",
    birthProvince: "กรุงเทพมหานคร",
  };
  try {
    const body = (await request.json()) as FortuneRequestBody;
    const { fullName, gender, birthDate, birthHour, birthMinute, birthProvince } = body;

    if (
      !fullName?.trim() ||
      !gender?.trim() ||
      !birthDate?.trim() ||
      !birthHour?.trim() ||
      !birthMinute?.trim() ||
      !birthProvince?.trim()
    ) {
      return NextResponse.json(
        { message: "กรอกข้อมูลให้ครบก่อนนะ แล้วเราจะวิเคราะห์ให้ทันที" },
        { status: 400 },
      );
    }

    const apiKey = readGeminiApiKey();

    if (process.env.NODE_ENV === "development") {
      console.log("API Status:", !!apiKey);
    }

    const normalizedBody: Required<FortuneRequestBody> = {
      fullName: fullName.trim(),
      gender: gender.trim(),
      birthDate: birthDate.trim(),
      birthHour: birthHour.trim(),
      birthMinute: birthMinute.trim(),
      birthProvince: birthProvince.trim(),
    };
    safeFallback = normalizedBody;

    const birthDetail = getBirthSignDetail(
      normalizedBody.birthDate,
      normalizedBody.birthHour,
      normalizedBody.birthMinute,
      normalizedBody.birthProvince,
    );
    const computedLagna = birthDetail?.signName ?? "ไม่พบลักขณา";
    const chartDigest = birthDetail?.thaiChart ? formatThaiChartDigestForPrompt(birthDetail) : null;

    if (!apiKey) {
      return NextResponse.json(buildLocalFallback(normalizedBody), { status: 200 });
    }

    const birthTime = `${birthHour.trim().padStart(2, "0")}:${birthMinute.trim().padStart(2, "0")}`;
    const genderLabel =
      gender === "female"
        ? "หญิง"
        : gender === "male"
          ? "ชาย"
          : gender === "non-binary"
            ? "ไม่ระบุ/อื่น ๆ"
            : gender.trim();

    const userPrompt = `ข้อมูลผู้รับคำทำนาย:

- ชื่อ-นามสกุล: ${normalizedBody.fullName}
- เพศ: ${genderLabel}
- วันเกิด: ${normalizedBody.birthDate}
- เวลาเกิด (ท้องถิ่น): ${birthTime}
- จังหวัดที่เกิด: ${normalizedBody.birthProvince}

ลักขณา (คำนวณระบบแล้ว — ค่าฟิกซ์): ราศี${computedLagna} — ห้ามใช้ราศีขึ้นอื่นที่ขัดกับค่านี้
${chartDigest ? `\n${chartDigest}\n` : ""}
จงสร้างคำทำนายส่วนบุคคลตามกฎของ Mu-Lab Algorithm โดยเน้นลักขณา (ราศีขึ้น) และบริบทชีวิตร่วมสมัย — หากมีบล็อกข้อมูลดวงดิบด้านบน ให้ตีความความสัมพันธ์ของดาวจากตำแหน่งนั้นเท่านั้น ห้ามคิดลัคนา/ดาวใหม่

เวลาเกิดที่ส่งมา (รวม 00:00 หรือ 23:59) ให้ถือเป็นข้อมูลจริงของผู้ใช้ ไม่ต้องขอให้ยืนยันเพิ่ม

สำคัญ: บรรทัดแรกของคำตอบต้องเป็น [METERS: ตัวเลข, ตัวเลข, ตัวเลข] (การงาน, การเงิน, ความรัก) แล้วบรรทัดว่าง แล้วตามด้วย ## ลักษณะนิสัย ทันที`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelCandidates = [
      readGeminiChatModel(),
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-1.5-flash-latest",
    ].filter((name, i, arr) => name.length > 0 && arr.indexOf(name) === i);

    let text = "";
    let lastModelTried = "";
    let lastError: unknown;

    for (const modelName of modelCandidates) {
      lastModelTried = modelName;
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: buildMuLabSystemPrompt(computedLagna, chartDigest),
        });
        const result = await model.generateContent(userPrompt);
        const extracted = extractGeminiResponseText(result.response);
        if (extracted.trim()) {
          text = extracted;
          if (process.env.NODE_ENV === "development") {
            console.log("[fortune] ok model:", modelName, "chars:", text.length);
          }
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!text?.trim()) {
      console.error("[fortune] no text from Gemini", { lastModelTried, lastError });
      return NextResponse.json(buildLocalFallback(normalizedBody), { status: 200 });
    }

    const { body: cleanedMessage, meters } = splitMetersFromFortuneText(text);

    return NextResponse.json(
      {
        message: cleanedMessage,
        meters,
        birthSign: computedLagna,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[fortune]", error);
    const fb = buildLocalFallback(safeFallback);
    return NextResponse.json(fb, { status: 200 });
  }
}
