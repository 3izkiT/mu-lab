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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="เข้าสู่ระบบ Mu-Lab"
    >
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(3,7,17,0.78)] backdrop-blur-md"
      />
      <div className="relative z-10 w-full max-w-md overflow-y-auto rounded-3xl border border-[rgba(247,231,206,0.2)] bg-[#0a1024]/95 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-8 max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#dbe1ff]/75 transition hover:bg-white/[0.08]"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path
              fill="currentColor"
              d="M14.7 6.3a1 1 0 0 0-1.4-1.4L10 8.6 6.7 5.3A1 1 0 0 0 5.3 6.7L8.6 10l-3.3 3.3a1 1 0 1 0 1.4 1.4L10 11.4l3.3 3.3a1 1 0 0 0 1.4-1.4L11.4 10z"
            />
          </svg>
        </button>
        <LoginForm nextPath={nextPath} onClose={onClose} />
      </div>
    </div>
  );
}
