import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { HoverConstellation } from "@/components/CinematicCelestial";
import HeaderActions from "@/components/HeaderActions";
import { getCurrentUser } from "@/lib/auth-utils";

type SiteNavHeaderProps = {
  /** true = โลโก้ 46px เหมือนหน้าแรก, false = 40px สำหรับหน้าย่อย */
  logoLarge?: boolean;
};

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/#fortune-form", label: "ดูดวงทันที" },
  { href: "/daily-horoscope", label: "ดูดวงรายวัน" },
  { href: "/tarot", label: "ไพ่ยิปซี" },
  { href: "/#services", label: "บริการและแพ็กเกจ" },
  { href: "/the-science-behind-mu-lab", label: "เกี่ยวกับ Mu-Lab" },
];

/**
 * Header กลางของเว็บ — โครงเดียวทุกหน้า เปลี่ยนแค่บอดี้
 *
 * Layout (ทุกขนาดจอ):
 *   [Logo]  [Desktop nav (links)]  [HeaderActions: Log in + เริ่มวิเคราะห์]  [Burger (มือถือ)]
 *
 * - Log in / เริ่มวิเคราะห์ อยู่นอกเมนู burger เสมอ — ผู้ใช้กดได้ทันทีโดยไม่ต้องเปิดเมนู
 * - Log in เปิดเป็น modal (LoginDialog) ไม่ navigate ไปหน้า /login
 * - หากล็อกอินแล้ว Log in กลายเป็น UserMenu (avatar + dropdown logout)
 * - มี cookie fallback: ถ้า `mu_lab_uid` cookie มีอยู่แม้ DB instance ไม่เห็น user
 *   ก็ยังถือว่า logged-in เพื่อกัน UI flicker
 */
export async function SiteNavHeader({ logoLarge = false }: SiteNavHeaderProps) {
  const img = logoLarge ? { w: 46, h: 46, cls: "h-[46px] w-[46px]" } : { w: 40, h: 40, cls: "h-10 w-10" };
  const user = await getCurrentUser().catch(() => null);
  const cookieStore = await cookies();
  const hasUidCookie = Boolean(cookieStore.get("mu_lab_uid")?.value);
  const isAuthenticated = Boolean(user) || hasUidCookie;
  const displayName = user?.name ?? null;
  const displayEmail = user?.email ?? null;

  return (
    <header className="sticky top-0 z-50 bg-[rgba(6,10,22,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-8 sm:py-4 lg:px-10">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="หน้าแรก Mu-Lab">
          <Image
            src="/logo-brand-v2.png"
            alt="Mu Lab"
            width={img.w}
            height={img.h}
            priority
            sizes={`${img.w}px`}
            className={`mu-lab-logo-solid mu-lab-logo-living shrink-0 rounded-full object-cover ${img.cls}`}
          />
          <p className="truncate font-serif text-lg tracking-tight text-[var(--gold)] sm:text-2xl">Mu-Lab</p>
        </Link>

        <nav className="!hidden flex-1 items-center justify-center gap-1.5 lg:!flex xl:gap-2">
          {NAV_LINKS.map((item) => (
            <HoverConstellation key={item.href}>
              <Link
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07] xl:px-4"
              >
                {item.label}
              </Link>
            </HoverConstellation>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <HeaderActions
            isAuthenticated={isAuthenticated}
            userName={displayName}
            userEmail={displayEmail}
          />

          <details className="group relative !block lg:!hidden">
            <summary className="list-none rounded-full border border-white/15 px-3 py-2 text-xs text-zinc-200 sm:text-sm">
              เมนู
            </summary>
            <div className="absolute right-0 z-[60] mt-2 max-h-[min(70vh,24rem)] w-[min(100vw-2rem,15rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-[#071024]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/vault"
                    className="block rounded-xl px-3 py-2 text-sm text-zinc-100 hover:bg-white/[0.08]"
                  >
                    Personal Vault ({displayName || displayEmail || "Member"})
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-100 hover:bg-white/[0.08]"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : null}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
