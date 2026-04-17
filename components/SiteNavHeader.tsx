import Image from "next/image";
import Link from "next/link";
import { GlintWrap, HoverConstellation } from "@/components/CinematicCelestial";

type SiteNavHeaderProps = {
  /** true = โลโก้ 46px เหมือนหน้าแรก, false = 40px สำหรับหน้าย่อย */
  logoLarge?: boolean;
};

/**
 * เมนูหลักเดียวกับหน้าแรก — ใช้ลิงก์ `/#…` เพื่อกลับไปแอนเคอร์บนหน้าแรกจากหน้าย่อย
 */
export function SiteNavHeader({ logoLarge = false }: SiteNavHeaderProps) {
  const img = logoLarge ? { w: 46, h: 46, cls: "h-[46px] w-[46px]" } : { w: 40, h: 40, cls: "h-10 w-10" };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(6,10,22,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="หน้าแรก Mu-Lab">
          <Image
            src="/logo-brand-v2.png"
            alt="Mu Lab"
            width={img.w}
            height={img.h}
            className={`mu-lab-logo-solid mu-lab-logo-living shrink-0 rounded-full object-cover ${img.cls}`}
          />
          <p className="truncate font-serif text-xl tracking-tight text-[var(--gold)] sm:text-2xl">Mu-Lab</p>
        </Link>
        <nav className="!hidden flex-wrap items-center justify-end gap-2 lg:!flex">
          <HoverConstellation>
            <Link
              href="/#fortune-form"
              className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              ดูดวงทันที
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link href="/daily-horoscope" className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]">
              ดูดวงรายวัน
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link href="/tarot" className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]">
              ไพ่ยิปซี
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link href="/#services" className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]">
              บริการและแพ็กเกจ
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link
              href="/the-science-behind-mu-lab"
              className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              เกี่ยวกับ Mu-Lab
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link href="/login" className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]">
              Log in
            </Link>
          </HoverConstellation>
          <HoverConstellation>
            <Link
              href="/#fortune-form"
              className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#241d16] shadow-[0_0_28px_rgba(247,231,206,0.26)] transition hover:brightness-105"
            >
              <GlintWrap>เริ่มวิเคราะห์</GlintWrap>
            </Link>
          </HoverConstellation>
        </nav>
        <details className="group relative !block lg:!hidden">
          <summary className="list-none rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200">
            เมนู
          </summary>
          <div className="absolute right-0 z-[60] mt-2 max-h-[min(70vh,24rem)] w-[min(100vw-2rem,16rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-[#071024]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <Link href="/#fortune-form" className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]">
              ดูดวงทันที
            </Link>
            <Link href="/daily-horoscope" className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]">
              ดูดวงรายวัน
            </Link>
            <Link href="/tarot" className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]">
              ไพ่ยิปซี
            </Link>
            <Link href="/#services" className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]">
              บริการและแพ็กเกจ
            </Link>
            <Link
              href="/the-science-behind-mu-lab"
              className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]"
            >
              เกี่ยวกับ Mu-Lab
            </Link>
            <Link href="/login" className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]">
              Log in
            </Link>
            <Link
              href="/#fortune-form"
              className="mt-1 block rounded-xl bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-3 py-2 text-center text-sm font-semibold text-[#241d16]"
            >
              เริ่มวิเคราะห์
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
