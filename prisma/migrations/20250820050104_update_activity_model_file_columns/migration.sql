/*
  Warnings:

  - You are about to drop the column `details` on the `activities` table. All the data in the column will be lost.
  - Added the required column `fileCount` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."activities" DROP COLUMN "details",
ADD COLUMN     "fileCount" INTEGER NOT NULL,
ADD COLUMN     "fileSize" TEXT NOT NULL;
