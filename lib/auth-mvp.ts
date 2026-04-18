import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const DEMO_USER_ID = "demo-user";
export const GUEST_USER_ID = "guest";

export async function ensureMvpUsers() {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: { id: DEMO_USER_ID, name: "Demo User", credits: 120 },
  });

  await prisma.user.upsert({
    where: { id: GUEST_USER_ID },
    update: {},
    create: { id: GUEST_USER_ID, name: "Guest", credits: 0 },
  });
}
