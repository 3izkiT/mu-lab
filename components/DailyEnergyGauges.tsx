"use client";

import { motion } from "framer-motion";
import { Activity, Component, Heart, type LucideIcon } from "lucide-react";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

type Props = {
  scores: { work: number; love: number; health: number };
  animateKey: string;
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

export default function DailyEnergyGauges({ scores, animateKey }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ROWS.map(({ key, labelTh, labelEn, Icon }, index) => {
        const v = scores[key];
        return (
          <div key={key} className="mu-lab-glass rounded-2xl p-4">
            <div className="mb-2 flex items-end justify-between gap-2">
              <p className="flex items-center gap-2 text-[11px] font-light text-[#d9f2e9]">
                <Icon
                  strokeWidth={CELESTIAL_STROKE}
                  className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]"
                  aria-hidden
                />
                <span>
                  {labelTh}{" "}
                  <span className="text-[10px] text-[#d9f2e9]/55">({labelEn})</span>
                </span>
              </p>
              <motion.span
                key={`${animateKey}-${key}-n`}
                className="font-mono text-sm tabular-nums text-[var(--gold)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {v}%
              </motion.span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1b254a]">
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
