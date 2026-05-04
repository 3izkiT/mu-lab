"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  initial?: string;
};

export default function UserMenu({ name, email, initial }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore network error — cookie still cleared on next request */
    }
    setOpen(false);
    setLoggingOut(false);
    router.push("/");
    router.refresh();
  }

  const display = name?.trim() || email || "Member";
  const avatar = (initial || display.slice(0, 1) || "M").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-[rgba(247,231,206,0.32)] bg-[rgba(247,231,206,0.08)] px-3 py-1.5 text-sm text-[#eef1ff] transition hover:bg-[rgba(247,231,206,0.14)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#d9bb85_100%)] text-xs font-semibold text-[#241d16]">
          {avatar}
        </span>
        <span className="hidden max-w-[140px] truncate text-xs sm:inline">{display}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-white/12 bg-[#071024]/95 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <div className="border-b border-white/8 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/70">Member</p>
            <p className="mt-1 truncate text-sm text-[#eef1ff]">{name || display}</p>
            {email ? <p className="truncate text-xs text-[#dbe1ff]/70">{email}</p> : null}
          </div>
          <Link
            href="/vault"
            className="block px-4 py-2 text-sm text-[#e8eeff]/90 transition hover:bg-white/[0.06]"
            onClick={() => setOpen(false)}
          >
            Personal Vault
          </Link>
          <Link
            href="/tracking"
            className="block px-4 py-2 text-sm text-[#e8eeff]/90 transition hover:bg-white/[0.06]"
            onClick={() => setOpen(false)}
          >
            Premium Tracking
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="block w-full border-t border-white/8 px-4 py-2 text-left text-sm text-[#f7c9b6] transition hover:bg-white/[0.06] disabled:opacity-60"
          >
            {loggingOut ? "กำลังออกจากระบบ…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
