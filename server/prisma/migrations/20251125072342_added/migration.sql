-- CreateIndex
CREATE INDEX "PendingUpdates_taskId_idx" ON "PendingUpdates"("taskId");

-- CreateIndex
CREATE INDEX "PendingUpdates_updateBy_idx" ON "PendingUpdates"("updateBy");

-- CreateIndex
CREATE INDEX "Task_assignedTo_idx" ON "Task"("assignedTo");

-- CreateIndex
CREATE INDEX "Task_assignedBy_idx" ON "Task"("assignedBy");

-- CreateIndex
CREATE INDEX "Task_categoryId_idx" ON "Task"("categoryId");
