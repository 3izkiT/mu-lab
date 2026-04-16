"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";
import { Command } from "cmdk";
import { getProvincesForCommand } from "@/constants/provinces";

type ProvinceCommandProps = {
  value: string;
  onChange: (province: string) => void;
  disabled?: boolean;
};

export default function ProvinceCommand({ value, onChange, disabled }: ProvinceCommandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const provinces = useMemo(() => getProvincesForCommand(), []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className="relative z-[80] w-full min-w-0">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((o) => !o)}
        className="group mu-lab-input flex w-full items-center justify-between gap-3 rounded-2xl py-3.5 pl-4 pr-3 text-left text-sm text-zinc-100 disabled:opacity-40"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <MapPin
            strokeWidth={CELESTIAL_STROKE}
            className={`h-4 w-4 shrink-0 transition-colors group-focus-within:text-[var(--gold)] ${open ? "text-[var(--gold)]" : "text-[var(--icon-muted)]"}`}
            aria-hidden
          />
          <span className={`min-w-0 truncate ${value ? "text-zinc-100" : "text-zinc-600"}`}>
            {value || "ค้นหาหรือเลือกจังหวัด..."}
          </span>
        </span>
        <ChevronDown
          strokeWidth={CELESTIAL_STROKE}
          className={`mu-lab-icon-interactive h-4 w-4 shrink-0 text-[var(--gold)]/85 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <Command
          label="จังหวัดที่เกิด"
          className="province-cmdk absolute z-[220] mt-2 w-full overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.18)] bg-[#0c1220]/95 shadow-[0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(247,231,206,0.06)] backdrop-blur-2xl"
          loop
        >
          <Command.Input
            placeholder="พิมพ์ชื่อจังหวัด..."
            className="w-full border-b border-[rgba(247,231,206,0.08)] bg-transparent px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <Command.List className="max-h-[min(52vh,280px)] overflow-y-auto overscroll-contain p-1.5">
            <Command.Empty className="px-3 py-6 text-center text-xs font-light text-zinc-500">
              ไม่พบจังหวัดที่ตรงกับคำค้น
            </Command.Empty>
            <Command.Group heading="จังหวัด">
              {provinces.map((p) => (
                <Command.Item
                  key={p}
                  value={p}
                  keywords={[p]}
                  onSelect={() => {
                    onChange(p);
                    setOpen(false);
                  }}
                  className="flex min-h-[44px] cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 outline-none data-[selected=true]:bg-[rgba(247,231,206,0.08)] aria-selected:bg-[rgba(247,231,206,0.1)] sm:min-h-0"
                >
                  <span>{p}</span>
                  {value === p ? (
                    <Check strokeWidth={CELESTIAL_STROKE} className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      )}
    </div>
  );
}
