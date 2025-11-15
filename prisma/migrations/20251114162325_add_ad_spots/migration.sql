-- CreateTable
CREATE TABLE "AdSpot" (
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
    "clicks" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "AdSpot_stripeSessionId_key" ON "AdSpot"("stripeSessionId");

-- CreateIndex
CREATE INDEX "AdSpot_isActive_idx" ON "AdSpot"("isActive");

-- CreateIndex
CREATE INDEX "AdSpot_expiresAt_idx" ON "AdSpot"("expiresAt");
