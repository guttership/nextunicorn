-- CreateTable
CREATE TABLE "Idea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiPrompt" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isChampion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL DEFAULT 0,
    "isDaily" BOOLEAN NOT NULL DEFAULT true,
    "aiPromptId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voterId" TEXT NOT NULL,
    "winnerIdeaId" INTEGER NOT NULL,
    "loserIdeaId" INTEGER NOT NULL,
    "duelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_winnerIdeaId_fkey" FOREIGN KEY ("winnerIdeaId") REFERENCES "Idea" ("id") ON DELETE CASCADE,
    CONSTRAINT "Vote_loserIdeaId_fkey" FOREIGN KEY ("loserIdeaId") REFERENCES "Idea" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX "Idea_score_idx" ON "Idea"("score");

-- CreateIndex
CREATE INDEX "Idea_createdAt_idx" ON "Idea"("createdAt");

-- CreateIndex
CREATE INDEX "Idea_generatedAt_idx" ON "Idea"("generatedAt");

-- CreateIndex
CREATE INDEX "Vote_voterId_idx" ON "Vote"("voterId");

-- CreateIndex
CREATE INDEX "Vote_duelId_idx" ON "Vote"("duelId");

-- CreateIndex
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_duelId_key" ON "Vote"("voterId", "duelId");
