/** อ่านจาก process.env.GEMINI_API_KEY — ตัด BOM และช่องว่างรอบข้าง */
export function readGeminiApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY;
  if (raw == null) return null;
  const normalized = raw.replace(/^\uFEFF/, "").trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * ชื่อโมเดลสำหรับ generateContent (Flash)
 * ค่าเริ่มต้น gemini-2.5-flash — gemini-2.0-flash ถูก deprecate
 * ตั้ง GEMINI_CHAT_MODEL ใน env ได้ถ้าต้องการ pin เวอร์ชัน
 */
export function readGeminiChatModel(): string {
  const raw = process.env.GEMINI_CHAT_MODEL;
  const m = typeof raw === "string" ? raw.replace(/^\uFEFF/, "").trim() : "";
  return m.length > 0 ? m : "gemini-2.5-flash";
}
