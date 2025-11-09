-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."Category_name_key";

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
