"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

export { CELESTIAL_STROKE };

export const celestialGold = "text-[var(--gold)]";
export const celestialMuted = "text-[var(--icon-muted)]";

type IntroMotion = "fade" | "none";

type CelestialIconProps = {
  icon: LucideIcon;
  className?: string;
  size?: number;
  /** Champagne gold (default) or midnight-muted for inputs */
  tone?: "gold" | "muted" | "mutedFocus";
  /** Hover: scale 1.1 + soft gold glow */
  interactive?: boolean;
  /** Subtle entrance (replaces heavy “pop” icons) */
  intro?: IntroMotion;
  "aria-hidden"?: boolean;
};

export function CelestialIcon({
  icon: Icon,
  className = "",
  size = 16,
  tone = "gold",
  interactive = false,
  intro = "none",
  "aria-hidden": ariaHidden = true,
}: CelestialIconProps) {
  const toneClass =
    tone === "gold"
      ? celestialGold
      : tone === "muted"
        ? `${celestialMuted} transition-colors duration-200`
        : `${celestialMuted} transition-colors duration-200 group-focus-within:text-[var(--gold)]`;

  const inner = (
    <Icon
      aria-hidden={ariaHidden}
      width={size}
      height={size}
      strokeWidth={CELESTIAL_STROKE}
      className={`shrink-0 ${toneClass} ${interactive ? "mu-lab-icon-interactive" : ""} ${className}`.trim()}
    />
  );

  if (intro === "fade") {
    return (
      <motion.span
        className="inline-flex"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.span>
    );
  }

  return <span className="inline-flex">{inner}</span>;
}

type HeadingIconRowProps = {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
  orbitSlow?: boolean;
  breathe?: boolean;
};

/** Decorative heading: geometric Lucide + title (Celestial Archive) */
export function CelestialHeadingRow({
  icon: Icon,
  children,
  className = "",
  iconClassName = "",
  orbitSlow = false,
  breathe = false,
}: HeadingIconRowProps) {
  const inner = (
    <span
      className={`inline-flex shrink-0 text-[var(--gold)] ${orbitSlow ? "mu-lab-orbit-spin" : ""} ${breathe ? "mu-lab-icon-breathe" : ""} ${iconClassName}`.trim()}
      aria-hidden
    >
      <Icon
        strokeWidth={CELESTIAL_STROKE}
        className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
      />
    </span>
  );

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3 ${className}`.trim()}>
      <motion.span
        className="inline-flex shrink-0 sm:mt-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.span>
      <div className="min-w-0 w-full flex-1 sm:w-auto">{children}</div>
    </div>
  );
}
