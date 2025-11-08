/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_userId_projectId_key" ON "public"."ProjectMembers"("userId", "projectId");
