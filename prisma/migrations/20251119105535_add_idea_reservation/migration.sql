-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservationPrice" DOUBLE PRECISION,
ADD COLUMN     "reservedAt" TIMESTAMP(3),
ADD COLUMN     "reservedBy" TEXT;

-- CreateIndex
CREATE INDEX "Idea_isReserved_idx" ON "Idea"("isReserved");
