/** อ่านจาก process.env.GEMINI_API_KEY — ตัด BOM และช่องว่างรอบข้าง */
export function readGeminiApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY;
  if (raw == null) return null;
  const normalized = raw.replace(/^\uFEFF/, "").trim();
  return normalized.length > 0 ? normalized : null;
}
