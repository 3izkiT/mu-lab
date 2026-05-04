"use client";

import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
  nextPath?: string;
};

export default function LoginDialog({ open, onClose, nextPath }: LoginDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="เข้าสู่ระบบ Mu-Lab">
      {/* Blurred backdrop — fills viewport, click closes */}
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="mu-lab-modal-backdrop absolute inset-0 cursor-default bg-[rgba(3,5,16,0.72)] backdrop-blur-2xl backdrop-saturate-150"
      />

      {/* Scroll wrapper — flex centers; if card is taller than viewport, scroll inside this layer */}
      <div className="absolute inset-0 overflow-y-auto px-4 py-6 sm:py-10">
        <div className="mx-auto flex min-h-full items-center justify-center">
          <div className="mu-lab-modal-card relative w-full max-w-md">
            {/* outer conic glow halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[2px] rounded-[28px] bg-[conic-gradient(from_140deg_at_50%_50%,rgba(247,231,206,0.55)_0deg,rgba(163,175,255,0.32)_120deg,rgba(247,231,206,0.55)_240deg,rgba(163,175,255,0.32)_360deg)] opacity-70 blur-[12px]"
            />
            {/* gradient ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[1px] rounded-[26px] bg-[linear-gradient(135deg,rgba(247,231,206,0.55)_0%,rgba(163,175,255,0.18)_45%,rgba(247,231,206,0.55)_100%)] opacity-90"
            />

            <div className="relative overflow-hidden rounded-3xl border border-[rgba(247,231,206,0.18)] bg-[radial-gradient(circle_at_18%_0%,rgba(247,231,206,0.16)_0%,transparent_55%),radial-gradient(circle_at_82%_100%,rgba(99,118,228,0.22)_0%,transparent_60%),linear-gradient(160deg,#0c1330_0%,#06091e_55%,#02040f_100%)] p-6 shadow-[0_60px_140px_rgba(0,0,0,0.65)] sm:p-8">
              <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(247,231,206,0.22)_0%,transparent_70%)]" />
              <div className="pointer-events-none absolute -bottom-24 -right-12 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(163,175,255,0.22)_0%,transparent_70%)]" />

              <button
                type="button"
                onClick={onClose}
                aria-label="ปิด"
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-[#dbe1ff]/85 backdrop-blur-md transition hover:bg-white/[0.12] hover:text-[#eef1ff]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M14.7 6.3a1 1 0 0 0-1.4-1.4L10 8.6 6.7 5.3A1 1 0 0 0 5.3 6.7L8.6 10l-3.3 3.3a1 1 0 1 0 1.4 1.4L10 11.4l3.3 3.3a1 1 0 0 0 1.4-1.4L11.4 10z"
                  />
                </svg>
              </button>

              <div className="relative">
                <LoginForm nextPath={nextPath} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
