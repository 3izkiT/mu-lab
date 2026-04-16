"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/vault";
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
            MVP นี้เปิดโหมด demo login เพื่อทดสอบ flow การเก็บสิทธิ์และ paywall end-to-end
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="mt-6 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Demo"}
          </button>
        </div>
      </div>
    </main>
  );
}
