-- Drop old AdSpot table
DROP TABLE IF EXISTS "AdSpot";

-- Create AdSlot table
CREATE TABLE "AdSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "side" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdSlot_position_side_key" UNIQUE ("position", "side")
);

-- Create Advertiser table
CREATE TABLE "Advertiser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "saasName" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL UNIQUE,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adSlotId" INTEGER NOT NULL,
    CONSTRAINT "Advertiser_adSlotId_fkey" FOREIGN KEY ("adSlotId") REFERENCES "AdSlot" ("id") ON DELETE CASCADE
);

-- Create indices
CREATE INDEX "AdSlot_isActive_idx" ON "AdSlot"("isActive");
CREATE INDEX "AdSlot_expiresAt_idx" ON "AdSlot"("expiresAt");
CREATE INDEX "Advertiser_adSlotId_idx" ON "Advertiser"("adSlotId");
