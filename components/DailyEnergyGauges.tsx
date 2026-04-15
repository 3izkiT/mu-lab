"use client";

import { motion } from "framer-motion";

type Props = {
  scores: { work: number; love: number; health: number };
  animateKey: string;
};

const ROWS: { key: keyof Props["scores"]; labelTh: string; labelEn: string }[] = [
  { key: "work", labelTh: "การงาน", labelEn: "Work" },
  { key: "love", labelTh: "ความรัก", labelEn: "Love" },
  { key: "health", labelTh: "สุขภาพ", labelEn: "Health" },
];

export default function DailyEnergyGauges({ scores, animateKey }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ROWS.map(({ key, labelTh, labelEn }, index) => {
        const v = scores[key];
        return (
          <div
            key={key}
            className="rounded-2xl border border-[rgba(247,231,206,0.55)] bg-white/80 p-3 shadow-[0_8px_24px_rgba(26,35,126,0.08)]"
          >
            <div className="mb-2 flex items-end justify-between gap-2">
              <p className="text-[11px] font-light text-[#1a237e]">
                {labelTh}{" "}
                <span className="text-[10px] text-[#1a237e]/55">({labelEn})</span>
              </p>
              <motion.span
                key={`${animateKey}-${key}-n`}
                className="font-mono text-sm tabular-nums text-[#1a237e]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {v}%
              </motion.span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e7ecfb] ring-1 ring-inset ring-[rgba(26,35,126,0.08)]">
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
