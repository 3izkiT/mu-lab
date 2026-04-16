/**
 * Gemini SDK: response.text() throws when candidates are blocked/empty.
 * Fall back to concatenating inline text parts.
 */
export function extractGeminiResponseText(response: {
  text: () => string;
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}): string {
  try {
    const direct = response.text();
    if (typeof direct === "string" && direct.trim()) return direct.trim();
  } catch {
    /* blocked or no text() */
  }

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts?.length) return "";

  return parts
    .map((p) => (typeof p.text === "string" ? p.text : ""))
    .join("")
    .trim();
}
