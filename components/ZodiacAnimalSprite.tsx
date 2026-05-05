"use client";

import { getSpriteSheetIndexForThaiSign, spriteCellFromIndex, ZODIAC_SPRITE_COLS, ZODIAC_SPRITE_ROWS } from "@/lib/zodiac-animal-sprite";

export const ZODIAC_ANIMAL_SPRITE_SRC = "/zodiac-animal-sprites.png";

type ZodiacAnimalSpriteProps = {
  signName: string;
  /** ขนาดกรอบแสดง (px) — ไม่ใช้คู่กับ `fill` */
  size?: number;
  /** เต็มพาเรนต์ (ต้องกำหนดขนาดพาเรนต์จากภายนอก) */
  fill?: boolean;
  className?: string;
  /** บนพื้นมืด — ให้พื้นดำจางและเส้นทองเด่น */
  blendScreen?: boolean;
  /** เส้นขอบกรมสำหรับวงกลมลักขณา */
  rounded?: "full" | "lg" | "none";
};

export function ZodiacAnimalSprite({
  signName,
  size = 72,
  fill = false,
  className = "",
  blendScreen = true,
  rounded = "full",
}: ZodiacAnimalSpriteProps) {
  const idx = getSpriteSheetIndexForThaiSign(signName);
  const { col, row } = spriteCellFromIndex(idx);

  const roundClass = rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-xl" : "";

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-black ${fill ? "h-full min-h-[2rem] w-full min-w-[2rem]" : ""} ${roundClass} ${className}`}
      style={fill ? undefined : { width: size, height: size }}
      aria-hidden
    >
      <img
        src={ZODIAC_ANIMAL_SPRITE_SRC}
        alt=""
        draggable={false}
        className={`pointer-events-none absolute max-w-none select-none ${blendScreen ? "mix-blend-screen" : ""}`}
        style={{
          width: `${ZODIAC_SPRITE_COLS * 100}%`,
          height: `${ZODIAC_SPRITE_ROWS * 100}%`,
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        }}
      />
    </div>
  );
}
