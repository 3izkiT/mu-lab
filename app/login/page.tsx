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
  const [rememberMe, setRememberMe] = useState(true);
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
      if (rememberMe) {
        try {
          const stored = localStorage.getItem("mu_lab_stored_credentials");
          const creds: StoredCredential[] = stored ? JSON.parse(stored) : [];
          const exists = creds.find((c) => c.email === email);
          if (!exists) {
            creds.push({ email, label: name || email });
            localStorage.setItem("mu_lab_stored_credentials", JSON.stringify(creds.slice(-5)));
          }
        } catch {
          // ignore
        }
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

            <label className="mt-4 flex items-center gap-3 text-sm text-[#dbe1ff]/75">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border border-white/20 bg-[#050a18] text-[var(--gold)] focus:ring-[var(--gold)]"
              />
              <span>จำอีเมลนี้ไว้สำหรับครั้งถัดไป</span>
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
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.35 11.1h-9.7v2.8h5.55c-.2 1.2-1.1 2.8-2.75 3.7l4.05 3c2.35-2.15 3.7-5.4 3.7-9.5 0-.65-.05-1.3-.15-1.9z" fill="#4285F4" />
                <path d="M11.65 21.9c2.35 0 4.3-.75 5.7-2.05l-4.05-3c-.95.65-2.15 1.05-3.65 1.05-2.8 0-5.15-1.9-6-4.45l-3.15 2.45c1.7 3.35 5.15 5.9 9.15 5.9z" fill="#34A853" />
                <path d="M5.65 13.4c-.25-.75-.4-1.55-.4-2.4 0-.85.15-1.65.4-2.4l-3.15-2.45C1.15 7.75.5 9.75.5 11.95c0 2.2.65 4.2 1.8 5.8l3.35-2.35z" fill="#FBBC05" />
                <path d="M11.65 6.1c1.25 0 2.35.45 3.2 1.35l2.35-2.35C15.95 3.5 13.95 2.5 11.65 2.5 7.65 2.5 4.2 5.05 2.5 8.4l3.15 2.45c.85-2.55 3.2-4.75 6-4.75z" fill="#EA4335" />
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
