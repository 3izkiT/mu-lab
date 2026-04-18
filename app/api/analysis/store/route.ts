import { POST as OriginalPost } from "@/app/api/analysis/saves/route";

// แปะยันต์บังคับ Vercel ให้รู้ว่าไฟล์นี้ห้าม Build ล่วงหน้า
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// สร้างฟังก์ชันมารับช่วงต่อแบบถูกท่า
export async function POST(request: Request) {
  return OriginalPost(request);
}