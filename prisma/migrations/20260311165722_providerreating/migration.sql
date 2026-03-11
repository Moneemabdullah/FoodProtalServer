/*
  Warnings:

  - You are about to drop the column `rating` on the `ProviderProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "providerProfileRating" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providerProfileRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providerProfileRating_providerId_userId_key" ON "providerProfileRating"("providerId", "userId");

-- AddForeignKey
ALTER TABLE "providerProfileRating" ADD CONSTRAINT "providerProfileRating_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providerProfileRating" ADD CONSTRAINT "providerProfileRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
