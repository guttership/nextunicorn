-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdSpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "saasName" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "saasNameBack" TEXT,
    "logoUrlBack" TEXT,
    "targetUrlBack" TEXT,
    "clicksBack" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_AdSpot" ("clicks", "createdAt", "customerEmail", "expiresAt", "id", "isActive", "logoUrl", "plan", "saasName", "stripeSessionId", "targetUrl") SELECT "clicks", "createdAt", "customerEmail", "expiresAt", "id", "isActive", "logoUrl", "plan", "saasName", "stripeSessionId", "targetUrl" FROM "AdSpot";
DROP TABLE "AdSpot";
ALTER TABLE "new_AdSpot" RENAME TO "AdSpot";
CREATE UNIQUE INDEX "AdSpot_stripeSessionId_key" ON "AdSpot"("stripeSessionId");
CREATE INDEX "AdSpot_isActive_idx" ON "AdSpot"("isActive");
CREATE INDEX "AdSpot_expiresAt_idx" ON "AdSpot"("expiresAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
