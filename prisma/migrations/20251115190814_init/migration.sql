-- CreateTable
CREATE TABLE "Idea" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiPrompt" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isChampion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL DEFAULT 0,
    "isDaily" BOOLEAN NOT NULL DEFAULT true,
    "aiPromptId" TEXT NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaTranslation" (
    "id" SERIAL NOT NULL,
    "ideaId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "IdeaTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "voterId" TEXT NOT NULL,
    "winnerIdeaId" INTEGER NOT NULL,
    "loserIdeaId" INTEGER NOT NULL,
    "duelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "side" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertiser" (
    "id" SERIAL NOT NULL,
    "saasName" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adSlotId" INTEGER NOT NULL,

    CONSTRAINT "Advertiser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Idea_score_idx" ON "Idea"("score");

-- CreateIndex
CREATE INDEX "Idea_createdAt_idx" ON "Idea"("createdAt");

-- CreateIndex
CREATE INDEX "Idea_generatedAt_idx" ON "Idea"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaTranslation_ideaId_language_key" ON "IdeaTranslation"("ideaId", "language");

-- CreateIndex
CREATE INDEX "Vote_voterId_idx" ON "Vote"("voterId");

-- CreateIndex
CREATE INDEX "Vote_duelId_idx" ON "Vote"("duelId");

-- CreateIndex
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_duelId_key" ON "Vote"("voterId", "duelId");

-- CreateIndex
CREATE INDEX "AdSlot_isActive_idx" ON "AdSlot"("isActive");

-- CreateIndex
CREATE INDEX "AdSlot_expiresAt_idx" ON "AdSlot"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_position_side_key" ON "AdSlot"("position", "side");

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_stripeSessionId_key" ON "Advertiser"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Advertiser_adSlotId_idx" ON "Advertiser"("adSlotId");

-- CreateIndex
CREATE INDEX "Advertiser_isApproved_idx" ON "Advertiser"("isApproved");

-- AddForeignKey
ALTER TABLE "IdeaTranslation" ADD CONSTRAINT "IdeaTranslation_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_winnerIdeaId_fkey" FOREIGN KEY ("winnerIdeaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_loserIdeaId_fkey" FOREIGN KEY ("loserIdeaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertiser" ADD CONSTRAINT "Advertiser_adSlotId_fkey" FOREIGN KEY ("adSlotId") REFERENCES "AdSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
