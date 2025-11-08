/*
  Warnings:

  - A unique constraint covering the columns `[name,projectId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,title]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_name_projectId_key" ON "public"."Category"("name", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_ownerId_title_key" ON "public"."Project"("ownerId", "title");
