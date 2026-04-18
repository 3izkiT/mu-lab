import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import TarotExperience from "@/components/TarotExperience";
import { getTarotReadingForUser } from "@/lib/tarot-engine";

export const dynamic = 'force-dynamic';

type TarotPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function TarotPage({ searchParams }: TarotPageProps) {
  const user = await getCurrentUser();
  const { readingId } = await searchParams;
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-14">
        <div className="mu-lab-glass rounded-3xl p-8 text-center">
          <h1 className="font-serif text-3xl text-[#eef1ff]">ดูดวงไพ่ยิปซี</h1>
          <p className="mt-3 text-sm text-[#dbe1ff]/80">เข้าสู่ระบบก่อนเพื่อรับสิทธิ์เปิดไพ่ฟรีวันละ 1 ครั้ง</p>
          <Link
            href="/login?next=/tarot"
            className="mt-6 inline-flex rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16]"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>
    );
  }

  const initialResult =
    readingId && readingId.trim() ? await getTarotReadingForUser(user.id, readingId.trim()) : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <TarotExperience initialResult={initialResult} />
    </main>
  );
}
