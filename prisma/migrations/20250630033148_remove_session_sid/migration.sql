/*
  Warnings:

  - You are about to drop the column `sid` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_sid_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sid";
