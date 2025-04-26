/*
  Warnings:

  - You are about to drop the column `isBanned` on the `ServiceProvider` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `ServiceProvider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "isBanned",
DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;
