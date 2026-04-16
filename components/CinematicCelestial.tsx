"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

type HoverConstellationProps = {
  children: ReactNode;
  className?: string;
};

type FloatingProps = {
  children: ReactNode;
  className?: string;
  /** Anchor id for in-page links (e.g. #fortune-form) */
  id?: string;
};

type GlintWrapProps = {
  children: ReactNode;
  className?: string;
};

const softMotion: Transition = {
  duration: 1,
  ease: [0.2, 0.8, 0.2, 1],
};

export function ParallaxNebula() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 48, damping: 22, mass: 0.55 });
  const y = useSpring(my, { stiffness: 48, damping: 22, mass: 0.55 });
  const xBack = useTransform(x, (v) => v * -0.32);
  const yBack = useTransform(y, (v) => v * -0.32);
  const bgPosX = useTransform(x, (v) => 50 + v * 0.22);
  const bgPosY = useTransform(y, (v) => 42 + v * 0.18);
  const nebulaBackgroundPosition = useMotionTemplate`${bgPosX}% ${bgPosY}%`;

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (event: MouseEvent) => {
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      mx.set(px * 16);
      my.set(py * 12);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduceMotion]);

  return (
    <>
      {/* Fixed nebula plate — subtle mouse parallax for depth */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundColor: "#03050f",
          backgroundImage: "url(/hero-nebula.png)",
          backgroundSize: "cover",
          backgroundPosition: nebulaBackgroundPosition,
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />
      {/* Luxury read legibility: center ~40% black → edges ~80% midnight navy */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 115% 110% at 50% 42%, rgba(0,0,0,0.4) 0%, rgba(6,9,22,0.68) 55%, rgba(4,7,18,0.8) 100%)",
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          x: reduceMotion ? 0 : x,
          y: reduceMotion ? 0 : y,
          background:
            "radial-gradient(68% 52% at 28% 20%, rgba(109,124,226,0.14) 0%, transparent 66%), radial-gradient(46% 38% at 78% 18%, rgba(154,95,215,0.12) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[2] mu-lab-blueprint"
        style={{ x: reduceMotion ? 0 : xBack, y: reduceMotion ? 0 : yBack }}
        aria-hidden
      />
    </>
  );
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...softMotion, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Floating({ children, className, id }: FloatingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      id={id}
      animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
      transition={reduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlintWrap({ children, className }: GlintWrapProps) {
  const reduceMotion = useReducedMotion();
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ""}`}>
      {children}
      {!reduceMotion ? (
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-8 bg-[linear-gradient(95deg,transparent_0%,rgba(255,255,255,0.0)_20%,rgba(247,231,206,0.7)_52%,rgba(255,255,255,0.0)_80%,transparent_100%)]"
          initial={{ x: "-180%" }}
          animate={{ x: ["-180%", "240%"] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 3.9, ease: "easeInOut" }}
        />
      ) : null}
    </span>
  );
}

export function HoverConstellation({ children, className }: HoverConstellationProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [dot, setDot] = useState({ x: 0, y: 0 });
  const [center, setCenter] = useState({ cx: 0, cy: 0 });
  const dx = dot.x - center.cx;
  const dy = dot.y - center.cy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCenter({ cx: rect.width / 2, cy: rect.height / 2 });
        setDot({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
    >
      {children}
      {hovered ? (
        <>
          <motion.span
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
            style={{ left: dot.x - 3, top: dot.y - 3 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="pointer-events-none absolute h-px bg-[var(--gold)]/65"
            style={{
              left: center.cx,
              top: center.cy,
              width: distance,
              transformOrigin: "left center",
              transform: `rotate(${angle}deg)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
        </>
      ) : null}
    </div>
  );
}

