"use client";

import { useState } from "react";
import Link from "next/link";
import LoginDialog from "@/components/LoginDialog";
import UserMenu from "@/components/UserMenu";

type HeaderActionsProps = {
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
};

const GOLD_PRIMARY =
  "rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#241d16] shadow-[0_0_24px_rgba(247,231,206,0.26)] transition hover:brightness-105 sm:px-5 sm:text-sm";

const GOLD_OUTLINE =
  "rounded-full border border-[rgba(247,231,206,0.55)] bg-[rgba(247,231,206,0.06)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.14)] sm:px-5 sm:text-sm";

export default function HeaderActions({ isAuthenticated, userName, userEmail }: HeaderActionsProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
      {isAuthenticated ? (
        <UserMenu name={userName} email={userEmail} />
      ) : (
        <button type="button" onClick={() => setLoginOpen(true)} className={GOLD_OUTLINE}>
          Log in
        </button>
      )}
      <Link href="/#fortune-form" className={GOLD_PRIMARY}>
        เริ่มวิเคราะห์
      </Link>
      {!isAuthenticated ? (
        <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} nextPath="/vault" />
      ) : null}
    </div>
  );
}
