import Image from "next/image";
import { Sparkles } from "lucide-react";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#060c1f_0%,#030711_52%,#02040a_100%)]">
      <div className="pointer-events-none absolute inset-0 mu-lab-starfield" aria-hidden />
      <div className="pointer-events-none absolute inset-0 mu-lab-blueprint" aria-hidden />

      <div className="mu-lab-glass flex flex-col items-center gap-6 rounded-[1.8rem] px-12 py-10">
        <div className="flex items-center gap-2 text-[var(--gold)]">
          <span className="mu-lab-icon-breathe inline-flex" aria-hidden>
            <Sparkles className="h-4 w-4" strokeWidth={CELESTIAL_STROKE} />
          </span>
          <span className="text-[10px] font-light uppercase tracking-[0.28em] text-[var(--gold)]/80">Quantum</span>
        </div>
        <div className="relative grid h-[104px] w-[104px] place-items-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--gold)]/20" />
          <span className="relative grid h-[104px] w-[104px] place-items-center overflow-hidden rounded-full bg-[var(--background)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <Image
              src="/logo-loader-v2.png"
              alt="Mu Lab loading"
              width={104}
              height={104}
              className="h-[104px] w-[104px] rounded-full object-cover"
              priority
            />
          </span>
        </div>
        <p className="font-serif text-sm tracking-[0.12em] text-[var(--gold)]/90">Initializing Mu-Lab Orbit...</p>
      </div>
    </main>
  );
}

