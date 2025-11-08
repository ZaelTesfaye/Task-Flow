/*
  Warnings:

  - You are about to drop the column `newAssignment` on the `PendingUpdates` table. All the data in the column will be lost.
  - You are about to drop the column `newCategoryId` on the `PendingUpdates` table. All the data in the column will be lost.
  - You are about to drop the column `newDescription` on the `PendingUpdates` table. All the data in the column will be lost.
  - You are about to drop the column `newTitle` on the `PendingUpdates` table. All the data in the column will be lost.
  - You are about to drop the column `updateTitle` on the `PendingUpdates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PendingUpdates" DROP COLUMN "newAssignment",
DROP COLUMN "newCategoryId",
DROP COLUMN "newDescription",
DROP COLUMN "newTitle",
DROP COLUMN "updateTitle";
