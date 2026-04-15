import Image from "next/image";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#060c1f_0%,#030711_52%,#02040a_100%)]">
      <div className="pointer-events-none absolute inset-0 mu-lab-starfield" aria-hidden />
      <div className="pointer-events-none absolute inset-0 mu-lab-blueprint" aria-hidden />

      <div className="mu-lab-glass flex flex-col items-center gap-6 rounded-[1.8rem] px-12 py-10">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--gold)]/20" />
          <Image
            src="/logo-loader.png"
            alt="Mu Lab loading"
            width={104}
            height={104}
            className="relative h-[104px] w-[104px] rounded-full object-cover"
            priority
          />
        </div>
        <p className="font-serif text-sm tracking-[0.12em] text-[var(--gold)]/90">Initializing Mu-Lab Orbit...</p>
      </div>
    </main>
  );
}

