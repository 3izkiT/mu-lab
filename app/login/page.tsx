"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

type StoredCredential = { email: string; label: string };

export default function LoginPage() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/vault";
  const error = params.get("error");
  const [loading, setLoading] = useState(false);
  const allowDemoLogin = process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === "1";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [storedCredentials, setStoredCredentials] = useState<StoredCredential[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mu_lab_stored_credentials");
      if (stored) {
        setStoredCredentials(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUseStoredCredential = (storedEmail: string) => {
    setEmail(storedEmail);
    setPassword("");
    setMode("login");
  };

  const submitLabel = useMemo(() => {
    if (loading) return "กำลังดำเนินการ...";
    return mode === "login" ? "เข้าสู่ระบบด้วยอีเมล" : "สมัครสมาชิกด้วยอีเมล";
  }, [loading, mode]);

  const handleEmailAuth = async () => {
    setFormError(null);
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/email/login" : "/api/auth/email/register";
      const payload =
        mode === "login"
          ? { email, password, nextPath }
          : { email, password, name, nextPath };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { redirectUrl?: string; message?: string };
      if (!response.ok) {
        setFormError(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      
      // Store credential for future login
      try {
        const stored = localStorage.getItem("mu_lab_stored_credentials");
        const creds: StoredCredential[] = stored ? JSON.parse(stored) : [];
        const exists = creds.find(c => c.email === email);
        if (!exists) {
          creds.push({ email, label: name || email });
          localStorage.setItem("mu_lab_stored_credentials", JSON.stringify(creds.slice(-5)));
        }
      } catch {
        // ignore
      }
      
      window.location.href = data.redirectUrl || "/vault";
    } finally {
      setLoading(false);
    }
  };

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
          {error || formError ? (
            <p className="mt-3 text-xs text-rose-300">
              {formError ?? `เข้าสู่ระบบไม่สำเร็จ (${error}) — ตรวจ env OAuth หรือ callback URL แล้วลองใหม่`}
            </p>
          ) : null}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                  mode === "login"
                    ? "bg-[rgba(247,231,206,0.14)] text-[var(--gold)]"
                    : "border border-white/10 text-[#dbe1ff]/75 hover:bg-white/[0.06]"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
                  mode === "register"
                    ? "bg-[rgba(247,231,206,0.14)] text-[var(--gold)]"
                    : "border border-white/10 text-[#dbe1ff]/75 hover:bg-white/[0.06]"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {storedCredentials.length > 0 && mode === "login" ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-[#dbe1ff]/70">เลือกจากการล็อคอินครั้งก่อน</p>
                {storedCredentials.map((cred, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseStoredCredential(cred.email)}
                    className="w-full rounded-xl border border-[rgba(247,231,206,0.2)] bg-[rgba(247,231,206,0.08)] px-3 py-2 text-xs text-[#dbe1ff]/85 transition hover:bg-[rgba(247,231,206,0.14)]"
                  >
                    {cred.email}
                  </button>
                ))}
              </div>
            ) : null}

            {mode === "register" ? (
              <label className="mt-4 block">
                <span className="text-xs text-[#dbe1ff]/70">ชื่อที่แสดง (ไม่บังคับ)</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none ring-0 placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
                  placeholder="เช่น Mu-Lab Member"
                  autoComplete="name"
                />
              </label>
            ) : null}

            <label className="mt-4 block">
              <span className="text-xs text-[#dbe1ff]/70">อีเมล</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none ring-0 placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs text-[#dbe1ff]/70">รหัสผ่าน</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none ring-0 placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
                placeholder="อย่างน้อย 8 ตัวอักษร"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            <button
              type="button"
              onClick={handleEmailAuth}
              disabled={loading}
              className="mt-5 w-full rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-50 transition hover:shadow-lg"
            >
              {submitLabel}
            </button>
            <p className="mt-2 text-xs text-[#dbe1ff]/55">ระบบจะจดจำการเข้าสู่ระบบไว้ประมาณ 30 วัน</p>
          </div>

          <div className="mt-5 grid gap-2">
            <a
              href={`/api/auth/oauth/start?provider=google&next=${encodeURIComponent(nextPath)}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] transition hover:opacity-95"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" opacity="0.3" />
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 6l10 7.5L22 6v-0c0-1.1-.9-2-2-2z" />
              </svg>
              เข้าสู่ระบบด้วย Google
            </a>
          </div>
          {allowDemoLogin ? (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="mt-6 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-50"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Demo"}
            </button>
          ) : null}
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
