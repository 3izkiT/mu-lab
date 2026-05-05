"use client";

import { useState, useTransition } from "react";

type Props = { eventId: string };

export function SlipApproveButton({ eventId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={isPending || done}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await fetch("/api/admin/slip/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ eventId }),
            });
            if (!res.ok) {
              const body = (await res.json().catch(() => ({}))) as { message?: string };
              setError(body.message || "อนุมัติไม่สำเร็จ");
              return;
            }
            setDone(true);
          })
        }
        className="rounded-lg border border-amber-300/50 bg-amber-300/20 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/30 disabled:opacity-50"
      >
        {done ? "ปลดล็อคแล้ว" : isPending ? "กำลังปลดล็อค..." : "ปลดล็อคฉุกเฉิน"}
      </button>
      {error ? <p className="text-[11px] text-rose-300">{error}</p> : null}
    </div>
  );
}

