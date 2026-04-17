"use client";

import { motion } from "framer-motion";
import { Activity, Component, Heart, type LucideIcon } from "lucide-react";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

type Props = {
  scores: { work: number; love: number; health: number };
  animateKey: string;
  compact?: boolean;
};

const ROWS: {
  key: keyof Props["scores"];
  labelTh: string;
  labelEn: string;
  Icon: LucideIcon;
}[] = [
  { key: "work", labelTh: "การงาน", labelEn: "Work", Icon: Component },
  { key: "love", labelTh: "ความรัก", labelEn: "Love", Icon: Heart },
  { key: "health", labelTh: "สุขภาพ", labelEn: "Health", Icon: Activity },
];

const CARD_STYLES: Record<keyof Props["scores"], string> = {
  work: "border-[#89b6ff]/32 bg-[linear-gradient(135deg,rgba(45,85,164,0.28)_0%,rgba(23,42,90,0.24)_100%)]",
  love: "border-[#c194ff]/32 bg-[linear-gradient(135deg,rgba(105,56,162,0.3)_0%,rgba(54,30,95,0.24)_100%)]",
  health: "border-[#7bdcc5]/35 bg-[linear-gradient(135deg,rgba(28,114,103,0.28)_0%,rgba(16,68,72,0.24)_100%)]",
};

export default function DailyEnergyGauges({ scores, animateKey, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {ROWS.map(({ key, labelTh, labelEn, Icon }, index) => {
          const v = scores[key];
          return (
            <div key={key} className={`rounded-2xl border p-4 shadow-[0_12px_26px_rgba(8,14,30,0.28)] ${CARD_STYLES[key]}`}>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-bold text-[#edf3ff]">
                  <Icon
                    strokeWidth={CELESTIAL_STROKE}
                    className="h-4 w-4 shrink-0 text-[var(--gold)]"
                    aria-hidden
                  />
                  <span>
                    {labelTh} <span className="text-[10px] font-medium text-[#d7e8ff]/75">({labelEn})</span>
                  </span>
                </p>
                <motion.span
                  key={`${animateKey}-${key}-n`}
                  className="font-mono text-sm font-bold tabular-nums text-[var(--gold)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {v}%
                </motion.span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1b254a]/85">
                <motion.div
                  key={`${animateKey}-${key}-bar`}
                  className="h-full rounded-full bg-gradient-to-r from-[#f7e7ce] via-[#eed7ad] to-[#e7c786] shadow-[0_0_10px_rgba(247,231,206,0.45)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${v}%` }}
                  transition={{
                    duration: 1.05,
                    delay: 0.15 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
      {ROWS.map(({ key, labelTh, labelEn, Icon }, index) => {
        const v = scores[key];
        return (
          <div
            key={key}
            className={`rounded-2xl border p-5 shadow-[0_16px_36px_rgba(8,14,30,0.34)] sm:p-6 ${CARD_STYLES[key]}`}
          >
            <div className="mb-3 flex items-end justify-between gap-3">
              <p className="flex items-center gap-2.5 text-sm font-bold text-[#edf3ff] sm:text-base">
                <Icon
                  strokeWidth={CELESTIAL_STROKE}
                  className="h-4.5 w-4.5 shrink-0 text-[var(--gold)] sm:h-5 sm:w-5"
                  aria-hidden
                />
                <span>
                  {labelTh}{" "}
                  <span className="text-[11px] font-medium text-[#d7e8ff]/75">({labelEn})</span>
                </span>
              </p>
              <motion.span
                key={`${animateKey}-${key}-n`}
                className="font-mono text-base font-bold tabular-nums text-[var(--gold)] sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {v}%
              </motion.span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1b254a]/85">
              <motion.div
                key={`${animateKey}-${key}-bar`}
                className="h-full rounded-full bg-gradient-to-r from-[#f7e7ce] via-[#eed7ad] to-[#e7c786] shadow-[0_0_10px_rgba(247,231,206,0.45)]"
                initial={{ width: "0%" }}
                animate={{ width: `${v}%` }}
                transition={{
                  duration: 1.05,
                  delay: 0.15 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
