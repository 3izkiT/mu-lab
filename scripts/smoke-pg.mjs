import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const stamp = Date.now();
const userId = `smoke-u-${stamp}`;
const analysisId = `smoke-a-${stamp}`;

try {
  const user = await prisma.user.create({
    data: {
      id: userId,
      name: "Smoke User",
      email: `smoke-${stamp}@test.local`,
      passwordHash: "x",
    },
  });
  console.log("created user", user.id);

  const analysis = await prisma.analysis.create({
    data: {
      id: analysisId,
      userId: user.id,
      summary: "## ลักษณะนิสัย\nทดสอบ Postgres",
      deepInsight: "## ทำนายลึก\nรายละเอียด",
      career: 80,
      wealth: 70,
      love: 60,
      birthSign: "เมษ",
      fullName: "Smoke User",
      birthDate: "01/01/2000",
      birthTime: "12:00",
      birthProvince: "กรุงเทพฯ",
    },
  });
  console.log("created analysis", analysis.id);

  const found = await prisma.analysis.findUnique({ where: { id: analysisId } });
  console.log("read back", { id: found?.id, fullName: found?.fullName, birthSign: found?.birthSign });

  await prisma.analysis.delete({ where: { id: analysisId } });
  await prisma.user.delete({ where: { id: userId } });
  console.log("cleanup ok");
} catch (err) {
  console.error("FAIL", err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
