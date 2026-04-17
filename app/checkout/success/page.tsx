import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{ analysisId?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { analysisId } = await searchParams;
  const analysisLink = analysisId ? `/analysis/${analysisId}` : "/vault";

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.24)] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Payment Success</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Divine Connection Established</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">สิทธิ์ของคุณถูกอัปเดตแล้ว พร้อมใช้งานทันที</p>
        <Link
          href={analysisLink}
          className="mt-6 inline-block rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16]"
        >
          ไปที่ผลลัพธ์ของคุณ
        </Link>
      </div>
    </main>
  );
}
