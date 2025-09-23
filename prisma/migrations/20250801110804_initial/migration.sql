-- CreateTable
CREATE TABLE "public"."Tasks" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);
