-- CreateTable
CREATE TABLE "DailyHoroscopeArchive" (
    "dateKey" TEXT NOT NULL PRIMARY KEY,
    "headlineTh" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "sectionsJson" TEXT NOT NULL,
    "forecastJson" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "DailyHoroscopeArchive_updatedAt_idx" ON "DailyHoroscopeArchive"("updatedAt");
