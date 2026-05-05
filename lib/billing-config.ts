export type PurchaseType = "deep-insight" | "tarot-deep" | "premium-monthly";

export const PRICING_THB: Record<PurchaseType, number> = {
  "deep-insight": 19,
  "tarot-deep": 39,
  "premium-monthly": 159,
};

/**
 * one-off purchases are intentionally short-lived to create
 * a clear upgrade path to monthly VIP.
 */
export const ONE_OFF_ACCESS_DAYS = 7;

export function getPriceTHB(purchaseType: PurchaseType): number {
  return PRICING_THB[purchaseType];
}

export function oneOffCutoffDate(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - ONE_OFF_ACCESS_DAYS);
  return cutoff;
}

