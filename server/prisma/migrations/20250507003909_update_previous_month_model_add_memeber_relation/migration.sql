/*
  Warnings:

  - You are about to drop the column `date` on the `PreviousMonth` table. All the data in the column will be lost.
  - You are about to drop the column `totalClient` on the `PreviousMonth` table. All the data in the column will be lost.
  - Changed the type of `year` on the `PreviousMonth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PreviousMonth" DROP COLUMN "date",
DROP COLUMN "totalClient",
ADD COLUMN     "memberId" TEXT,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PreviousMonth" ADD CONSTRAINT "PreviousMonth_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
