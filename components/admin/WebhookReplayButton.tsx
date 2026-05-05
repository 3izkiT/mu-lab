"use client";

import { useState, useTransition } from "react";

type WebhookReplayButtonProps = {
  eventId: string;
};

export default function WebhookReplayButton({ eventId }: WebhookReplayButtonProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            const response = await fetch("/api/admin/webhook/stripe/replay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ eventId }),
            });
            if (!response.ok) {
              const payload = (await response.json().catch(() => ({}))) as { message?: string };
              setMessage(payload.message || "Replay failed");
              return;
            }
            setMessage("Replayed");
            window.location.reload();
          })
        }
        className="rounded-full border border-rose-300/40 px-3 py-1 text-[11px] text-rose-200 hover:bg-rose-300/10 disabled:opacity-50"
      >
        {pending ? "Replaying..." : "Replay failed event"}
      </button>
      {message ? <p className="mt-1 text-[11px] text-[#dbe1ff]/70">{message}</p> : null}
    </div>
  );
}

