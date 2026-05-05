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
    notes: "ปลดล็อกคำแนะนำรายวันเชิงตัดสินใจ + เลข/สีมงคล ใช้สิทธิ์ย้อนหลัง 7 วัน",
  },
  {
    key: "tarot-insight",
    label: "Tarot Insight (39 THB)",
    tier: "PAY_PER_VIEW",
    notes: "อ่านไพ่เชิงลึกผสานลัคนา + ถาม AI เพิ่ม 2 คำถาม สิทธิ์ย้อนหลัง 7 วัน",
  },
  {
    key: "soul-dashboard",
    label: "Soul Dashboard (VIP)",
    tier: "SUBSCRIBER",
    notes: "กราฟชีวิต 30 วัน, ปฏิทินวันเด่น/วันระวัง, นาทีทองแบบ real-time",
  },
  {
    key: "unlimited-deep",
    label: "Unlimited Deep Access (VIP)",
    tier: "SUBSCRIBER",
    notes: "ปลดล็อกเนื้อหาลึกทุกรายงานและไพ่ไม่จำกัดในช่วงสมาชิกยัง active",
  },
];

