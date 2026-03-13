-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'TRENDING', 'UNPOPULAR');

-- AlterTable
ALTER TABLE "Idea"
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "categoryTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "duelExposures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "firstExposedAt" TIMESTAMP(3),
ADD COLUMN     "firstVoteAt" TIMESTAMP(3),
ADD COLUMN     "lastExposedAt" TIMESTAMP(3),
ADD COLUMN     "lastVoteAt" TIMESTAMP(3),
ADD COLUMN     "lossCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promptProfileId" INTEGER,
ADD COLUMN     "rankingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" "IdeaStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trendScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "winCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "Idea"
SET "expiresAt" = COALESCE("createdAt", NOW()) + INTERVAL '15 days',
    "totalVotes" = (
      SELECT COUNT(*)
      FROM "Vote"
      WHERE "Vote"."winnerIdeaId" = "Idea"."id"
         OR "Vote"."loserIdeaId" = "Idea"."id"
    ),
    "winCount" = (
      SELECT COUNT(*)
      FROM "Vote"
      WHERE "Vote"."winnerIdeaId" = "Idea"."id"
    ),
    "lossCount" = (
      SELECT COUNT(*)
      FROM "Vote"
      WHERE "Vote"."loserIdeaId" = "Idea"."id"
    ),
    "firstVoteAt" = (
      SELECT MIN("createdAt")
      FROM "Vote"
      WHERE "Vote"."winnerIdeaId" = "Idea"."id"
         OR "Vote"."loserIdeaId" = "Idea"."id"
    ),
    "lastVoteAt" = (
      SELECT MAX("createdAt")
      FROM "Vote"
      WHERE "Vote"."winnerIdeaId" = "Idea"."id"
         OR "Vote"."loserIdeaId" = "Idea"."id"
    ),
    "score" = (
      SELECT COUNT(*)
      FROM "Vote"
      WHERE "Vote"."winnerIdeaId" = "Idea"."id"
    );

UPDATE "Idea"
SET "expiresAt" = NOW() + INTERVAL '15 days'
WHERE "expiresAt" IS NULL;

ALTER TABLE "Idea"
ALTER COLUMN "expiresAt" SET NOT NULL;

UPDATE "Idea"
SET "winRate" = CASE
  WHEN "totalVotes" = 0 THEN 0
  ELSE "winCount"::DOUBLE PRECISION / "totalVotes"::DOUBLE PRECISION
END;

UPDATE "Idea"
SET "status" = CASE
  WHEN "expiresAt" <= NOW() AND "totalVotes" = 0 THEN 'UNPOPULAR'::"IdeaStatus"
  WHEN "expiresAt" <= NOW() AND "totalVotes" > 0 THEN 'ARCHIVED'::"IdeaStatus"
  ELSE 'ACTIVE'::"IdeaStatus"
END;

-- CreateTable
CREATE TABLE "DuelExposure" (
    "id" SERIAL NOT NULL,
    "duelKey" TEXT NOT NULL,
    "voterId" TEXT,
    "ideaAId" INTEGER NOT NULL,
    "ideaBId" INTEGER NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votedAt" TIMESTAMP(3),
    "winnerIdeaId" INTEGER,
    "loserIdeaId" INTEGER,

    CONSTRAINT "DuelExposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptProfile" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "baseInstruction" TEXT NOT NULL,
    "positiveTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "negativeTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "generatedPrompt" TEXT NOT NULL,
    "rationale" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topIdeasCount" INTEGER NOT NULL DEFAULT 0,
    "bottomIdeasCount" INTEGER NOT NULL DEFAULT 0,
    "ignoredIdeasCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PromptProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Idea_status_idx" ON "Idea"("status");

-- CreateIndex
CREATE INDEX "Idea_expiresAt_idx" ON "Idea"("expiresAt");

-- CreateIndex
CREATE INDEX "Idea_duelExposures_idx" ON "Idea"("duelExposures");

-- CreateIndex
CREATE INDEX "Idea_totalVotes_idx" ON "Idea"("totalVotes");

-- CreateIndex
CREATE INDEX "Idea_rankingScore_idx" ON "Idea"("rankingScore");

-- CreateIndex
CREATE INDEX "Idea_trendScore_idx" ON "Idea"("trendScore");

-- CreateIndex
CREATE INDEX "DuelExposure_duelKey_idx" ON "DuelExposure"("duelKey");

-- CreateIndex
CREATE INDEX "DuelExposure_voterId_idx" ON "DuelExposure"("voterId");

-- CreateIndex
CREATE INDEX "DuelExposure_shownAt_idx" ON "DuelExposure"("shownAt");

-- CreateIndex
CREATE INDEX "DuelExposure_ideaAId_idx" ON "DuelExposure"("ideaAId");

-- CreateIndex
CREATE INDEX "DuelExposure_ideaBId_idx" ON "DuelExposure"("ideaBId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptProfile_version_key" ON "PromptProfile"("version");

-- CreateIndex
CREATE INDEX "PromptProfile_active_idx" ON "PromptProfile"("active");

-- CreateIndex
CREATE INDEX "PromptProfile_createdAt_idx" ON "PromptProfile"("createdAt");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_promptProfileId_fkey" FOREIGN KEY ("promptProfileId") REFERENCES "PromptProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelExposure" ADD CONSTRAINT "DuelExposure_ideaAId_fkey" FOREIGN KEY ("ideaAId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelExposure" ADD CONSTRAINT "DuelExposure_ideaBId_fkey" FOREIGN KEY ("ideaBId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;