/*
  Warnings:

  - Added the required column `aiPrompt` to the `IdeaTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add aiPrompt column with default value first
ALTER TABLE "IdeaTranslation" ADD COLUMN "aiPrompt" TEXT NOT NULL DEFAULT '';

-- Update existing translations with the parent idea's aiPrompt
UPDATE "IdeaTranslation" 
SET "aiPrompt" = (SELECT "aiPrompt" FROM "Idea" WHERE "Idea"."id" = "IdeaTranslation"."ideaId")
WHERE "aiPrompt" = '';

-- Remove default now that all rows have values
ALTER TABLE "IdeaTranslation" ALTER COLUMN "aiPrompt" DROP DEFAULT;
