import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import {
  ONE_OFF_ACCESS_DAYS,
  vipDailyCutoffDate,
  vipWeeklyCutoffDate,
  oneOffCutoffDate,
} from "@/lib/billing-config";

export type FeatureType = "deep-insight" | "premium" | "tarot-draw" | "tarot-deep";

export async function getCurrentUser() {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export function isAdminUserId(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const raw = process.env.ADMIN_USER_IDS?.trim();
  if (!raw) return false;
  const allowed = raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return allowed.includes(userId);
}

export async function getUserCredits(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.credits ?? 0;
}

export async function checkFeatureAccess(userId: string, featureType: FeatureType, targetId?: string) {
  await ensureMvpUsers();
  const now = Date.now();

  const premiumCount = await prisma.subscription.count({
    where: {
      userId,
      status: "active",
      planType: "premium",
      expiryDate: { gt: new Date(now) },
    },
  });
  const vipDailyCount = await prisma.purchase.count({
    where: {
      userId,
      featureType: "vip-daily",
      status: "completed",
      createdAt: { gte: vipDailyCutoffDate(new Date()) },
    },
  });
  const vipWeeklyCount = await prisma.purchase.count({
    where: {
      userId,
      featureType: "vip-weekly",
      status: "completed",
      createdAt: { gte: vipWeeklyCutoffDate(new Date()) },
    },
  });
  const hasGlobalPremium = premiumCount > 0 || vipDailyCount > 0 || vipWeeklyCount > 0;

  if (featureType === "premium") {
    return hasGlobalPremium;
  }

  if (featureType === "deep-insight") {
    if (hasGlobalPremium) return true;
    if (!targetId) return false;
    const dailyCutoff = vipDailyCutoffDate(new Date());
    const count = await prisma.purchase.count({
      where: {
        userId,
        featureType: "deep-insight",
        targetId,
        status: "completed",
        createdAt: { gte: dailyCutoff },
      },
    });
    return count > 0;
  }

  if (featureType === "tarot-draw") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return (user?.credits ?? 0) >= 10;
  }

  if (featureType === "tarot-deep") {
    if (hasGlobalPremium) return true;
    if (!targetId) return false;
    const cutoff = oneOffCutoffDate(new Date());
    const count = await prisma.purchase.count({
      where: {
        userId,
        featureType: "tarot-deep",
        targetId,
        status: "completed",
        createdAt: { gte: cutoff },
      },
    });
    return count > 0;
  }

  return false;
}

export function getOneOffAccessDays() {
  return ONE_OFF_ACCESS_DAYS;
}
