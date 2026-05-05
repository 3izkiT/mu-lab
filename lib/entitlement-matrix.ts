export type AccessTier = "FREE" | "PAY_PER_VIEW" | "SUBSCRIBER";

export type EntitlementRule = {
  key: string;
  label: string;
  tier: AccessTier;
  notes: string;
};

/**
 * Central product packaging matrix used by docs/admin/paywall copy.
 */
export const ENTITLEMENT_MATRIX: EntitlementRule[] = [
  {
    key: "daily-starter",
    label: "Starter Daily (19 THB)",
    tier: "PAY_PER_VIEW",
    notes: "ปลดล็อกเต็มระบบแบบรายวัน (24 ชั่วโมง) เหมาะกับการตัดสินใจเร่งด่วน",
  },
  {
    key: "weekly-pass",
    label: "Weekly Pass (79 THB)",
    tier: "PAY_PER_VIEW",
    notes: "ปลดล็อกเต็มระบบ 7 วัน เหมาะกับการติดตามต่อเนื่องทั้งสัปดาห์",
  },
  {
    key: "soul-dashboard",
    label: "Monthly VIP (159 THB)",
    tier: "SUBSCRIBER",
    notes: "ปลดล็อกเต็มระบบ 30 วัน พร้อม Soul Dashboard และเนื้อหาลึกไม่จำกัด",
  },
  {
    key: "unlimited-deep",
    label: "Unlimited Deep Access (VIP)",
    tier: "SUBSCRIBER",
    notes: "ปลดล็อกเนื้อหาลึกทุกรายงานและไพ่ไม่จำกัดในช่วงสมาชิกยัง active",
  },
];

