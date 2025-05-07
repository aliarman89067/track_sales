-- CreateEnum
CREATE TYPE "PrevMonthStatus" AS ENUM ('Not_Achieved', 'Achieved');

-- AlterTable
ALTER TABLE "PreviousMonth" ADD COLUMN     "status" "PrevMonthStatus" NOT NULL DEFAULT 'Not_Achieved';
