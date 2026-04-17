-- CreateTable
CREATE TABLE "TarotReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dateKey" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "cardsJson" TEXT NOT NULL,
    "preview" TEXT NOT NULL,
    "deepInsight" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TarotReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TarotDailyUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "dateKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TarotDailyUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TarotReading_userId_createdAt_idx" ON "TarotReading"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TarotDailyUsage_userId_dateKey_key" ON "TarotDailyUsage"("userId", "dateKey");
