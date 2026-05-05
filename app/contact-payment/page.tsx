import Link from "next/link";
import { ParallaxNebula } from "@/components/CinematicCelestial";
import { PRICING_THB } from "@/lib/billing-config";

export const metadata = {
  title: "ติดต่อ & ชำระเงิน",
  description: "ช่องทางการติดต่อและวิธีชำระเงินสำหรับบริการของ Mu-Lab",
};

export default function ContactPaymentPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.22)] p-8 sm:p-12">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Contact & Payment</p>
          <h1 className="mt-4 font-serif text-4xl text-[#eef1ff] sm:text-5xl">ติดต่อและชำระเงิน</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#dbe1ff]/85">
            เรามีหลากหลายช่องทางเพื่อให้คุณติดต่อเราและชำระเงินสำหรับบริการต่าง ๆ
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {/* Contact Section */}
            <div className="rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(5,10,24,0.3)] p-6">
              <h2 className="font-serif text-2xl text-[#eef1ff]">ติดต่อเรา</h2>
              <div className="mt-6 space-y-4 text-sm text-[#dbe1ff]/85">
                <div>
                  <p className="font-semibold text-[var(--gold)]">อีเมล</p>
                  <a href="mailto:contact@mu-lab.app" className="hover:underline">
                    contact@mu-lab.app
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-[var(--gold)]">Line Official</p>
                  <a href="https://line.me/R/ti/p/@mu-lab" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @mu-lab
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-[var(--gold)]">เวลาทำการ</p>
                  <p>จันทร์ - อาทิตย์ 09:00 - 18:00 (เวลากรุงเทพ)</p>
                </div>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(5,10,24,0.3)] p-6">
              <h2 className="font-serif text-2xl text-[#eef1ff]">วิธีชำระเงิน</h2>
              <div className="mt-6 space-y-4 text-sm text-[#dbe1ff]/85">
                <div>
                  <p className="font-semibold text-[var(--gold)]">บัตรเครดิต/เดบิต</p>
                  <p>Visa, Mastercard, American Express</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--gold)]">ธนาคาร</p>
                  <p>โอนเงินตรง (ธนาคารไทย)</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--gold)]">Mobile Payment</p>
                  <p>PromptPay, TrueMoney Wallet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Packages */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-[#eef1ff]">แพ็กเกจบริการ</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Starter Daily",
                  price: String(PRICING_THB["deep-insight"]),
                  features: ["รายงานเจาะลึกเฉพาะเคส", "ใช้สิทธิ์ย้อนหลัง 7 วัน", "เหมาะสำหรับตัดสินใจเร่งด่วน"],
                },
                {
                  title: "Tarot Insight",
                  price: String(PRICING_THB["tarot-deep"]),
                  features: ["บทอ่านลึกผสานลัคนา", "ถาม AI ต่อได้ 2 คำถาม", "สิทธิ์ย้อนหลัง 7 วัน"],
                },
                {
                  title: "Premium Monthly",
                  price: String(PRICING_THB["premium-monthly"]),
                  features: ["Soul Dashboard เต็ม 30 วัน", "ปลดล็อกเนื้อหาลึกไม่จำกัด", "เหมาะกับใช้งานทุกวัน"],
                },
              ].map((pkg) => (
                <div key={pkg.title} className="rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(5,10,24,0.3)] p-6">
                  <h3 className="font-serif text-xl text-[#eef1ff]">{pkg.title}</h3>
                  <p className="mt-3 text-3xl text-[var(--gold)]">
                    ฿{pkg.price}
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-[#dbe1ff]/85">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-[var(--gold)]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-4 py-2 text-sm font-semibold text-[#241d16] transition hover:brightness-105">
                    เลือก
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/vault"
              className="rounded-full border border-[rgba(247,231,206,0.4)] px-6 py-2.5 text-sm font-medium text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.1)]"
            >
              กลับไปยังคลัง
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
