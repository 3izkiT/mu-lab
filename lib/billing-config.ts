export type PurchaseType =
  | "deep-insight"
  | "tarot-deep"
  | "vip-daily"
  | "vip-weekly"
  | "premium-monthly";

export const PRICING_THB: Record<PurchaseType, number> = {
  "deep-insight": 19,
  "tarot-deep": 79,
  "vip-daily": 19,
  "vip-weekly": 79,
  "premium-monthly": 159,
};

/**
 * one-off purchases are intentionally short-lived to create
 * a clear upgrade path to monthly VIP.
 */
export const ONE_OFF_ACCESS_DAYS = 7;
export const VIP_DAILY_ACCESS_DAYS = 1;
export const VIP_WEEKLY_ACCESS_DAYS = 7;
export const VIP_MONTHLY_ACCESS_DAYS = 30;

export function getPriceTHB(purchaseType: PurchaseType): number {
  return PRICING_THB[purchaseType];
}

export function getAccessDays(purchaseType: PurchaseType): number {
  if (purchaseType === "deep-insight" || purchaseType === "vip-daily") return VIP_DAILY_ACCESS_DAYS;
  if (purchaseType === "tarot-deep" || purchaseType === "vip-weekly") return VIP_WEEKLY_ACCESS_DAYS;
  return VIP_MONTHLY_ACCESS_DAYS;
}

export function oneOffCutoffDate(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - ONE_OFF_ACCESS_DAYS);
  return cutoff;
}

export function vipDailyCutoffDate(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - VIP_DAILY_ACCESS_DAYS);
  return cutoff;
}

export function vipWeeklyCutoffDate(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - VIP_WEEKLY_ACCESS_DAYS);
  return cutoff;
}

