"use client";

import { useEffect, useRef } from "react";

type AdSlotProps = {
  /** AdSense slot ID (เช่น 1234567890) */
  slot: string;
  /** ค่า data-ad-format (default `auto`) */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  /** layout key สำหรับ in-feed/in-article ad */
  layout?: string;
  layoutKey?: string;
  /** className เพิ่มสำหรับห่อ ad */
  className?: string;
  /** กำหนดสไตล์ container — default min-height ป้องกัน CLS */
  style?: React.CSSProperties;
};

type AdsByGoogleArray = Array<Record<string, unknown>>;

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleArray;
  }
}

/**
 * Renders a single AdSense slot. ไม่ render ถ้า NEXT_PUBLIC_ADSENSE_CLIENT ไม่ถูกตั้ง.
 * วางในตำแหน่งที่ไม่กระทบ conversion (ไม่ใส่บน hero/CTA หลัก)
 */
export default function AdSlot({
  slot,
  format = "auto",
  layout,
  layoutKey,
  className,
  style,
}: AdSlotProps) {
  const ref = useRef<HTMLModElement | null>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("[AdSense] push error", err);
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div
      className={className}
      style={{ minHeight: 250, ...style }}
      aria-label="โฆษณา"
      role="complementary"
    >
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
