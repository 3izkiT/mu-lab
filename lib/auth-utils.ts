import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";

export type FeatureType = "deep-insight" | "premium" | "tarot-draw" | "tarot-deep";

export async function getCurrentUser() {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getUserCredits(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.credits ?? 0;
}

export async function checkFeatureAccess(userId: string, featureType: FeatureType, targetId?: string) {
  await ensureMvpUsers();
  const now = Date.now();

  if (featureType === "premium") {
    const count = await prisma.subscription.count({
      where: {
        userId,
        status: "active",
        planType: "premium",
        expiryDate: { gt: new Date(now) },
      },
    });
    return count > 0;
  }

  if (featureType === "deep-insight") {
    if (!targetId) return false;
    const count = await prisma.purchase.count({
      where: { userId, featureType: "deep-insight", targetId, status: "completed" },
    });
    return count > 0;
  }

  if (featureType === "tarot-draw") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return (user?.credits ?? 0) >= 10;
  }

  if (featureType === "tarot-deep") {
    if (!targetId) return false;
    const count = await prisma.purchase.count({
      where: { userId, featureType: "tarot-deep", targetId, status: "completed" },
    });
    return count > 0;
  }

  return false;
}
