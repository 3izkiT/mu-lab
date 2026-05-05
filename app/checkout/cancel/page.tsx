import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.24)] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Payment Cancelled</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">ยกเลิกการชำระเงินแล้ว</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">คุณสามารถกลับไปเลือกแพ็กที่เหมาะกับคุณได้ทุกเมื่อ</p>
        <Link
          href="/vault"
          className="mt-6 inline-block rounded-full border border-[rgba(247,231,206,0.4)] px-6 py-2.5 text-sm font-semibold text-[var(--gold)]"
        >
          กลับไปยัง Vault
        </Link>
      </div>
    </main>
  );
}

