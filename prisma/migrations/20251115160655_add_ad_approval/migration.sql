-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Advertiser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "saasName" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adSlotId" INTEGER NOT NULL,
    CONSTRAINT "Advertiser_adSlotId_fkey" FOREIGN KEY ("adSlotId") REFERENCES "AdSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Advertiser" ("adSlotId", "clicks", "createdAt", "customerEmail", "id", "logoUrl", "saasName", "stripeSessionId", "targetUrl") SELECT "adSlotId", "clicks", "createdAt", "customerEmail", "id", "logoUrl", "saasName", "stripeSessionId", "targetUrl" FROM "Advertiser";
DROP TABLE "Advertiser";
ALTER TABLE "new_Advertiser" RENAME TO "Advertiser";
CREATE UNIQUE INDEX "Advertiser_stripeSessionId_key" ON "Advertiser"("stripeSessionId");
CREATE INDEX "Advertiser_adSlotId_idx" ON "Advertiser"("adSlotId");
CREATE INDEX "Advertiser_isApproved_idx" ON "Advertiser"("isApproved");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineIndex
DROP INDEX "sqlite_autoindex_AdSlot_1";
CREATE UNIQUE INDEX "AdSlot_position_side_key" ON "AdSlot"("position", "side");
