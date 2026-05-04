import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { SiteNavHeader } from "@/components/SiteNavHeader";
import TarotExperience from "@/components/TarotExperience";
import { getTarotReadingForUser } from "@/lib/tarot-engine";

type TarotPageProps = {
  searchParams: Promise<{ readingId?: string }>;
};

export default async function TarotPage({ searchParams }: TarotPageProps) {
  const user = await getCurrentUser();
  const { readingId } = await searchParams;
  const initialResult =
    user && readingId && readingId.trim() ? await getTarotReadingForUser(user.id, readingId.trim()) : null;

  return (
    <>
      <SiteNavHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <TarotExperience initialResult={initialResult} />
        {!user ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.42)] p-4 text-sm text-[#dbe1ff]/80">
            ลองเปิดไพ่ได้เลยโดยไม่ต้องสมัครสมาชิก หากต้องการดูเชิงลึก/บันทึกประวัติให้ครบ ให้{" "}
            <Link href="/login?next=/tarot" className="text-[var(--gold)] underline-offset-2 hover:underline">
              สมัครหรือเข้าสู่ระบบ
            </Link>
          </div>
        ) : null}
      </main>
    </>
  );
}
