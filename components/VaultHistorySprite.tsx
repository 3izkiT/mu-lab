"use client";

import { ZodiacAnimalSprite } from "@/components/ZodiacAnimalSprite";

/** ไอคอนเล็กในหน้ารายการ Vault — ใช้ชื่อราศีลักขณาเดียวกับหน้า analysis */
export function VaultHistorySprite({ signName }: { signName: string }) {
  return (
    <span className="inline-flex shrink-0 align-middle">
      <ZodiacAnimalSprite signName={signName} size={40} rounded="lg" blendScreen className="ring-1 ring-[rgba(247,231,206,0.2)]" />
    </span>
  );
}
