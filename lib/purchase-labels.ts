import type { PurchaseType } from "@/lib/billing-config";

const PURCHASE_TITLE_TH: Record<PurchaseType, string> = {
  "vip-daily": "ปลดล็อกทั้งระบบ 1 วัน",
  "vip-weekly": "ปลดล็อกทั้งระบบ 7 วัน",
  "premium-monthly": "พรีเมียมทั้งระบบ 30 วัน",
  "deep-insight": "ปลดล็อกรายงานนี้ (รายครั้ง)",
  "tarot-deep": "ปลดล็อกบทอ่านไพ่ลึก (รายครั้ง)",
};

export function isPurchaseType(value: string | null | undefined): value is PurchaseType {
  return (
    value === "deep-insight" ||
    value === "tarot-deep" ||
    value === "vip-daily" ||
    value === "vip-weekly" ||
    value === "premium-monthly"
  );
}

export function getPurchaseTitleTh(purchaseType: PurchaseType): string {
  return PURCHASE_TITLE_TH[purchaseType];
}
