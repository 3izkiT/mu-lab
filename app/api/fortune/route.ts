import { NextResponse } from "next/server";

type FortuneRequestBody = {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  birthHour?: string;
  birthMinute?: string;
  birthProvince?: string;
};

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

    const promptPayload = {
      profile: {
        fullName: fullName.trim(),
        gender: gender.trim(),
        birthDate: birthDate.trim(),
        birthTime: `${birthHour.trim()}:${birthMinute.trim()}`,
        birthProvince: birthProvince.trim(),
      },
      instruction:
        "ช่วยวิเคราะห์ดวงแบบไทยร่วมสมัย ให้โทนภาษาอบอุ่น กระชับ ใช้งานได้จริง แบ่งหัวข้อความรัก การงาน การเงิน และสุขภาพ",
    };

    // Ready for Gemini integration:
    // 1) Put API key in GEMINI_API_KEY
    // 2) Call Gemini model with promptPayload
    // 3) Return generated analysis to client
    // const geminiResponse = await callGemini(promptPayload);

    return NextResponse.json(
      {
        message: "รับข้อมูลเรียบร้อยแล้ว กำลังเตรียมระบบวิเคราะห์ด้วย Gemini API",
        dataForGemini: promptPayload,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "ระบบมีปัญหาเล็กน้อย ลองใหม่อีกครั้งได้เลย" },
      { status: 500 },
    );
  }
}
