-- CreateTable
CREATE TABLE "IdeaTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ideaId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "IdeaTranslation_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "voterId" TEXT NOT NULL,
    "winnerIdeaId" INTEGER NOT NULL,
    "loserIdeaId" INTEGER NOT NULL,
    "duelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_winnerIdeaId_fkey" FOREIGN KEY ("winnerIdeaId") REFERENCES "Idea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_loserIdeaId_fkey" FOREIGN KEY ("loserIdeaId") REFERENCES "Idea" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("createdAt", "duelId", "id", "loserIdeaId", "voterId", "winnerIdeaId") SELECT "createdAt", "duelId", "id", "loserIdeaId", "voterId", "winnerIdeaId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_voterId_idx" ON "Vote"("voterId");
CREATE INDEX "Vote_duelId_idx" ON "Vote"("duelId");
CREATE INDEX "Vote_createdAt_idx" ON "Vote"("createdAt");
CREATE UNIQUE INDEX "Vote_voterId_duelId_key" ON "Vote"("voterId", "duelId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "IdeaTranslation_ideaId_language_key" ON "IdeaTranslation"("ideaId", "language");
