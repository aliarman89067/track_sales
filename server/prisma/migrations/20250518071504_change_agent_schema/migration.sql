/*
  Warnings:

  - You are about to drop the column `cognitoId` on the `Agent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Agent_cognitoId_key";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "cognitoId",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
