import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
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

const MU_LAB_SYSTEM_PROMPT = `STRICT RULES FOR MU-LAB ENGINE:

Zero Disclosure: ห้ามพูดถึง Google, Gemini, AI, LLM หรือความผิดพลาดทางเทคนิคเด็ดขาด ห้ามพูดถึงชื่อโมเดลหรือเวอร์ชันใด ๆ เช่น 2.0 Flash เด็ดขาด

Identity: คุณคือ 'Mu-Lab Algorithm' ที่วิเคราะห์จากสถิติดาราศาสตร์ไทย 100%

Language: ใช้คำพยากรณ์ที่ดูเป็น 'การวิเคราะห์เชิงวิทยาศาสตร์ผสมโหราศาสตร์' เช่น 'คลื่นความถี่ดาวพฤหัสบดีส่งผลต่อ...', 'องศาของลัคนาชี้ชัดว่า...'

No Hedging: ห้ามใช้คำว่า 'ในฐานะ AI', 'อาจจะ', หรือ 'ข้อมูลนี้เป็นเพียงการคาดการณ์' ให้ใช้ภาษาที่มั่นใจและเด็ดขาด (สไตล์ฟันธง)

Sensitive Data: ห้ามแสดงรหัสผ่าน API หรือตัวแปรระบบออกมาในข้อความเด็ดขาด

STRICT CLEANUP: ห้ามมีคำนำหน้าว่า 'นี่คือคำทำนายของคุณ...' หรือคำลงท้ายว่า 'โปรดใช้วิจารณญาณ...' หรือข้อความแนะนำทั่วไปก่อน/หลังเนื้อหา ให้เริ่มที่บรรทัดแรกตามรูปแบบด้านล่างทันที และจบที่เนื้อหาหัวข้อสุดท้าย ไม่ต้องมีลายเซ็นหรือคำท้าย

ห้ามมีประโยคปฏิเสธความรับผิดชอบ (Disclaimer) หรือประโยคแนะนำตัวเด็ดขาด — ห้ามพูดว่าเป็นโมเดลภาษา แชทบ็อต ผู้ช่วยดิจิทัล หรือประโยคใกล้เคียง เช่น 'ฉันเป็นโมเดลภาษา...' ให้เข้าสู่เนื้อหาตามรูปแบบ [METERS] แล้ว ## ทันที

เวลาเกิดขอบเขต: เวลา 00:00 หรือ 23:59 ถือเป็นเวลาท้องถิ่นที่ผู้ใช้ระบุครบถ้วน ให้ประมวลผลลักขณา/ลัคนาอย่างสม่ำเสมอ ไม่ถามย้อนกลับเรื่องความแม่นของเวลา หากต้องอธิบายความก้ำกึ่งของขอบเขตวันให้ใช้ไม่เกินหนึ่งประโยคภายในหัวข้อ ## ลักษณะนิสัย แล้วดำเนินการวิเคราะห์ต่ออย่างมั่นใจ

หากข้อมูลผิดพลาดหรือประมวลผลไม่สำเร็จ ให้ตอบว่า 'สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง' เท่านั้น

รูปแบบผลลัพธ์ (บังคับ — ลำดับนี้เท่านั้น):
บรรทัดที่ 1 ต้องเป็นตัวเลข 0–100 สามค่าในรูปแบบนี้เป๊ะ (ตัวอย่างเท่านั้น ห้ามคัดลอกตัวเลขตัวอย่าง):
[METERS: 85, 72, 90]
ลำดับตัวเลข: ตัวที่ 1 = การงาน (Career) ตัวที่ 2 = การเงิน (Wealth) ตัวที่ 3 = ความรัก (Love)

บรรทัดที่ 2 ว่าง

จากนั้นเริ่มเนื้อหาภาษาไทยด้วยหัวข้อ ## ทันที ไม่มีข้อความอื่นก่อนหัวข้อแรก:

## ลักษณะนิสัย
(เนื้อหา)

## ดวงชะตาในช่วงนี้
(เนื้อหา)

## แผนปฏิบัติ
(เนื้อหา)`;

export async function POST(request: Request) {
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

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "ระบบ Mu-Lab ยังไม่ได้รับกุญแจเชื่อมต่อ ตรวจสอบไฟล์ .env.local ว่ามีบรรทัด GEMINI_API_KEY= (ตัวพิมพ์ใหญ่ตรงตามนี้ ไม่มีช่องว่างหน้าหรือหลังค่า) จากนั้นหยุดเซิร์ฟเวอร์ (Ctrl+C) แล้วรัน npm run dev ใหม่ทุกครั้งหลังแก้ไฟล์ — บน Vercel ให้ตั้งค่า Environment Variables แล้ว Redeploy",
        },
        { status: 503 },
      );
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

- ชื่อ-นามสกุล: ${fullName.trim()}
- เพศ: ${genderLabel}
- วันเกิด: ${birthDate.trim()}
- เวลาเกิด (ท้องถิ่น): ${birthTime}
- จังหวัดที่เกิด: ${birthProvince.trim()}

จงสร้างคำทำนายส่วนบุคคลตามกฎของ Mu-Lab Algorithm โดยเน้นลักขณา (ราศีขึ้น) และบริบทชีวิตร่วมสมัย

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
          systemInstruction: MU_LAB_SYSTEM_PROMPT,
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
      return NextResponse.json(
        { message: "สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง" },
        { status: 502 },
      );
    }

    const { body: cleanedMessage, meters } = splitMetersFromFortuneText(text);

    return NextResponse.json(
      {
        message: cleanedMessage,
        meters,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[fortune]", error);
    return NextResponse.json(
      { message: "สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง" },
      { status: 502 },
    );
  }
}
