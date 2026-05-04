"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const params = useSearchParams();
  const nextPath = params.get("next") || "/vault";
  const error = params.get("error");

  return (
    <main className="relative min-h-screen px-4 py-20">
      <div className="mx-auto max-w-lg">
        <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.2)] p-6 sm:p-8">
          <LoginForm nextPath={nextPath} initialError={error} />
          <Link
            href="/"
            className="mt-4 block rounded-full border border-white/15 px-5 py-2 text-center text-sm text-[#dbe1ff]/85 transition hover:bg-white/[0.08]"
          >
            ปิดและกลับหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}
