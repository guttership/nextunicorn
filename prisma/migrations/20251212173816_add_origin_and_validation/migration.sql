-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('AI', 'COMMUNITY');

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "audience" TEXT,
ADD COLUMN     "communityValidatedAt" TIMESTAMP(3),
ADD COLUMN     "isCommunityValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "origin" "Origin" NOT NULL DEFAULT 'AI';
