"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/vault";
  const error = params.get("error");
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", nextPath }),
    });
    const payload = (await response.json()) as { redirectUrl?: string };
    window.location.href = payload.redirectUrl || "/vault";
  };

  return (
    <main className="relative min-h-screen px-4 py-20">
      <div className="mx-auto max-w-lg">
        <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.2)] p-8 text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Member Zone</p>
          <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">เข้าสู่ระบบ Mu-Lab</h1>
          <p className="mt-3 text-sm text-[#dbe1ff]/80">
            เลือกวิธีเข้าสู่ระบบเพื่อเข้าถึงพื้นที่สมาชิก ประวัติการทำนาย และสิทธิ์การใช้งานของคุณ
          </p>
          {error ? (
            <p className="mt-3 text-xs text-rose-300">
              เข้าสู่ระบบโซเชียลไม่สำเร็จ ({error}) — ตรวจ env OAuth หรือ callback URL แล้วลองใหม่
            </p>
          ) : null}
          <div className="mt-5 grid gap-2">
            <a
              href={`/api/auth/oauth/start?provider=google&next=${encodeURIComponent(nextPath)}`}
              className="rounded-full border border-white/25 px-5 py-2 text-sm text-[#e9eefc] transition hover:bg-white/[0.08]"
            >
              เข้าสู่ระบบด้วย Google
            </a>
            <a
              href={`/api/auth/oauth/start?provider=facebook&next=${encodeURIComponent(nextPath)}`}
              className="rounded-full border border-white/25 px-5 py-2 text-sm text-[#e9eefc] transition hover:bg-white/[0.08]"
            >
              เข้าสู่ระบบด้วย Facebook
            </a>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-6 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Demo"}
          </button>
          <Link
            href="/"
            className="mt-3 inline-block rounded-full border border-white/25 px-5 py-2 text-sm text-[#dbe1ff]/85 transition hover:bg-white/[0.08]"
          >
            ปิดและกลับหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}
