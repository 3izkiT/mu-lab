"use client";

const THAI_BIRTH_SIGNS = [
  { name: "มังกร", symbol: "♑", color: "#9D4EDD" },
  { name: "กุมภ์", symbol: "♒", color: "#7209B7" },
  { name: "มีน", symbol: "♓", color: "#560BAD" },
  { name: "เมษ", symbol: "♈", color: "#E0AAFF" },
  { name: "พฤษภ", symbol: "♉", color: "#D946EF" },
  { name: "เมถุน", symbol: "♊", color: "#C239B3" },
  { name: "กรกฎ", symbol: "♋", color: "#A0106F" },
  { name: "สิงห์", symbol: "♌", color: "#810E71" },
  { name: "กันย์", symbol: "♍", color: "#6A0DAD" },
  { name: "ตุลย์", symbol: "♎", color: "#5A189A" },
  { name: "พิจิก", symbol: "♏", color: "#480355" },
  { name: "ธนู", symbol: "♐", color: "#3C096C" },
] as const;

type BirthSignDisplayProps = {
  signName: string;
};

export function BirthSignDisplay({ signName }: BirthSignDisplayProps) {
  const sign = THAI_BIRTH_SIGNS.find((s) => s.name === signName);
  if (!sign) return null;

  return (
    <section className="rounded-3xl border border-[rgba(247,231,206,0.22)] bg-[rgba(5,10,24,0.35)] p-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">ลักขณาของคุณ</p>
        <h2 className="mt-4 font-serif text-4xl text-[#eef1ff]">{sign.name}</h2>
        <p className="mt-3 text-5xl" style={{ color: sign.color }}>
          {sign.symbol}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-4">
        {THAI_BIRTH_SIGNS.map((s) => (
          <div
            key={s.name}
            className={`rounded-2xl border p-4 text-center transition ${
              s.name === sign.name ? "border-[rgba(247,231,206,0.4)] bg-[rgba(247,231,206,0.1)]" : "border-white/10 bg-[rgba(5,10,24,0.5)]"
            }`}
          >
            <p className="text-xl" style={{ color: s.color }}>
              {s.symbol}
            </p>
            <p className={`mt-2 text-xs font-light ${s.name === sign.name ? "text-[#eef1ff]" : "text-[#dbe1ff]/70"}`}>{s.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
