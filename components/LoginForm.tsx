"use client";

import { useMemo, useState } from "react";

type LoginFormProps = {
  /** Path ที่จะ redirect หลังล็อกอินสำเร็จ (default `/vault`) */
  nextPath?: string;
  /** Error code มาจาก query string (เช่น OAuth callback fail) */
  initialError?: string | null;
  /** เรียกเมื่อกด "ปิด" — ใช้ใน modal. ถ้าไม่ส่ง จะแสดงปุ่ม Link ปิดกลับหน้าหลัก */
  onClose?: () => void;
};

const GOLD_BUTTON =
  "rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] shadow-[0_0_28px_rgba(247,231,206,0.26)] transition hover:brightness-105 disabled:opacity-50";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginForm({ nextPath = "/vault", initialError = null, onClose }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const allowDemoLogin = process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === "1";

  const submitLabel = useMemo(() => {
    if (loading) return "กำลังดำเนินการ...";
    return mode === "login" ? "เข้าสู่ระบบด้วยอีเมล" : "สมัครสมาชิกด้วยอีเมล";
  }, [loading, mode]);

  async function handleEmailAuth() {
    setFormError(null);
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/email/login" : "/api/auth/email/register";
      const payload =
        mode === "login" ? { email, password, nextPath } : { email, password, name, nextPath };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        redirectUrl?: string;
        message?: string;
      };
      if (!response.ok) {
        setFormError(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }
      window.location.href = data.redirectUrl || "/vault";
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user", nextPath }),
      });
      const payload = (await response.json()) as { redirectUrl?: string };
      window.location.href = payload.redirectUrl || "/vault";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-left">
      <p className="text-center text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Member Zone</p>
      <h2 className="mt-2 text-center font-serif text-2xl text-[#eef1ff] sm:text-3xl">เข้าสู่ระบบ Mu-Lab</h2>
      <p className="mt-2 text-center text-sm text-[#dbe1ff]/80">
        เข้าถึงพื้นที่สมาชิก ประวัติการทำนาย และสิทธิ์การใช้งานของคุณ
      </p>

      {initialError || formError ? (
        <p className="mt-3 text-center text-xs text-rose-300">
          {formError ??
            `เข้าสู่ระบบไม่สำเร็จ (${initialError}) — ตรวจ env OAuth หรือ callback URL แล้วลองใหม่`}
        </p>
      ) : null}

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
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

        {mode === "register" ? (
          <label className="mt-4 block">
            <span className="text-xs text-[#dbe1ff]/70">ชื่อที่แสดง (ไม่บังคับ)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
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
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
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
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#050a18]/50 px-4 py-2 text-sm text-[#e9eefc] outline-none placeholder:text-[#dbe1ff]/35 focus:border-[rgba(247,231,206,0.35)]"
            placeholder="อย่างน้อย 8 ตัวอักษร"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        <button
          type="button"
          onClick={handleEmailAuth}
          disabled={loading}
          className={`mt-5 w-full ${GOLD_BUTTON}`}
        >
          {submitLabel}
        </button>
        <p className="mt-2 text-center text-[10px] text-[#dbe1ff]/55">ระบบจะจดจำการเข้าสู่ระบบไว้ประมาณ 30 วัน</p>
      </div>

      <a
        href={`/api/auth/oauth/start?provider=google&next=${encodeURIComponent(nextPath)}`}
        className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#1f1f1f] shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition hover:brightness-95"
      >
        <GoogleIcon className="h-4.5 w-4.5" />
        <span>เข้าสู่ระบบด้วย Google</span>
      </a>

      {allowDemoLogin ? (
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className={`mt-3 w-full ${GOLD_BUTTON}`}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Demo"}
        </button>
      ) : null}

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="mt-4 block w-full rounded-full border border-white/15 px-5 py-2 text-sm text-[#dbe1ff]/85 transition hover:bg-white/[0.08]"
        >
          ปิด
        </button>
      ) : null}
    </div>
  );
}
