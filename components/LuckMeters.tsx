"use client";

import { motion } from "framer-motion";
import { Component, Heart, Mountain, type LucideIcon } from "lucide-react";
import type { LuckMetersData } from "@/lib/fortune-parse";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

const ROWS: { key: keyof LuckMetersData; labelTh: string; labelEn: string; Icon: LucideIcon }[] = [
  { key: "career", labelTh: "การงาน", labelEn: "Career", Icon: Component },
  { key: "wealth", labelTh: "การเงิน", labelEn: "Wealth", Icon: Mountain },
  { key: "love", labelTh: "ความรัก", labelEn: "Love", Icon: Heart },
];

type LuckMetersProps = {
  meters: LuckMetersData;
  animateKey: string;
};

export default function LuckMeters({ meters, animateKey }: LuckMetersProps) {
  return (
    <div className="mb-8 rounded-2xl border border-[rgba(247,231,206,0.12)] bg-[rgba(247,231,206,0.03)] p-4 shadow-[inset_0_1px_0_rgba(247,231,206,0.06)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]/80">
          Lab metrics
        </p>
        <span className="text-[10px] font-light text-zinc-600">ช่วงนี้</span>
      </div>
      <ul className="flex flex-col gap-4">
        {ROWS.map(({ key, labelTh, labelEn, Icon }, index) => {
          const value = meters[key];
          return (
            <li key={key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 text-[13px] font-light text-zinc-200 sm:text-sm">
                  <Icon
                    strokeWidth={CELESTIAL_STROKE}
                    className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]"
                    aria-hidden
                  />
                  <span>
                    {labelTh}{" "}
                    <span className="text-[10px] font-light text-zinc-600">({labelEn})</span>
                  </span>
                </span>
                <motion.span
                  key={`${animateKey}-${key}`}
                  className="font-mono text-xs tabular-nums text-[var(--gold)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.15, duration: 0.3 }}
                >
                  {value}%
                </motion.span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/90 ring-1 ring-inset ring-white/[0.06]">
                <motion.div
                  key={`${animateKey}-bar-${key}`}
                  className="h-full rounded-full bg-gradient-to-r from-[rgba(247,231,206,0.45)] via-[#f7e7ce] to-[rgba(247,231,206,0.75)] shadow-[0_0_16px_rgba(247,231,206,0.25)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${value}%` }}
                  transition={{
                    duration: 0.95,
                    delay: 0.12 + index * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
