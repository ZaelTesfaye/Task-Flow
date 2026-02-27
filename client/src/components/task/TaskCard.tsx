import React, { useState } from "react";
import { CheckCircle, XCircle, Edit2, Trash2, GitPullRequest, ArrowUpFromLine } from "lucide-react";
import { TaskStatus, UserRole } from "@/types";
import TaskDetailsModal from "./TaskDetailsModal";

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  active:
    "bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-600 dark:border-blue-800/60",
  complete:
    "bg-green-500 text-white border border-green-600 dark:bg-green-900/30 dark:text-green-600 dark:border-green-800/60",
  canceled: "bg-red-500 text-white border border-red-600 dark:bg-red-900/30 dark:text-red-600 dark:border-red-800/60",
};

export interface TaskCardProps {
  task: any;
  userRole: UserRole;
  currentUserId: string;
  phaseName: string;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onRequestUpdate: (taskId: string, description: string, status: TaskStatus) => void;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
  onReviewUpdate: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  currentUserId,
  phaseName,
  onRequestUpdate,
  onEdit,
  onDelete,
  onReviewUpdate,
}) => {
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      <div
        className={`cursor-pointer rounded-lg border p-2 transition-colors ${
          task.assignedTo === currentUserId
            ? "border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
            : "border-[hsl(var(--border))] bg-gray-100 hover:bg-gray-200 dark:bg-gray-900/50 dark:hover:bg-gray-800/50"
        }`}
        onClick={() => setShowDetailsModal(true)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Title */}
            <div className="mb-1 flex items-center gap-2">
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                  task.status === "complete"
                    ? "bg-green-500"
                    : task.status === "canceled"
                      ? "bg-red-500"
                      : task.assignedTo === currentUserId
                        ? "bg-blue-400"
                        : "border-2 border-gray-300 dark:border-gray-500"
                }`}
              >
                {task.status === "complete" && <CheckCircle className="h-3 w-3 text-white" />}
                {task.status === "canceled" && <XCircle className="h-3 w-3 text-white" />}
              </div>
              <h4
                className={`truncate text-sm font-medium text-[hsl(var(--foreground))] ${
                  task.status === "complete"
                    ? "line-through opacity-60"
                    : task.status === "canceled"
                      ? "text-red-500 line-through"
                      : ""
                }`}
              >
                {task.title}
              </h4>
            </div>

            {/* Description */}
            {task.description && (
              <p className="mb-2 line-clamp-2 pl-6 text-xs text-[hsl(var(--muted-foreground))]">{task.description}</p>
            )}

            {/* Status and Pending Updates */}
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                  TASK_STATUS_COLORS[task.status as keyof typeof TASK_STATUS_COLORS]
                }`}
              >
                {task.status}
              </span>
              {task.pendingUpdates && task.pendingUpdates.length > 0 && (
                <span className="rounded-full border border-yellow-300 bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-900 dark:border-yellow-800/60 dark:bg-yellow-900/30 dark:text-yellow-600">
                  {task.pendingUpdates.length} pending
                </span>
              )}
            </div>
          </div>

          {/* Assigned User & Action Buttons */}
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <span className="max-w-20 truncate text-right text-xs text-[hsl(var(--muted-foreground))] opacity-70">
              {task.assignedTo === currentUserId ? "You" : `To: ${task.assignedUser?.name}`}
            </span>
            <div className="flex items-center gap-0" onClick={(e) => e.stopPropagation()}>
              {/* Request Update Button - for assigned user only */}
              {task.assignedTo === currentUserId && !isOwnerOrAdmin && (
                <button
                  onClick={() => onRequestUpdate(task.id, "", task.status)}
                  className="rounded p-2 opacity-80 transition-colors hover:cursor-pointer hover:bg-gray-500"
                  title="Request Status Update"
                >
                  <ArrowUpFromLine className="h-4 w-4" />
                </button>
              )}

              {/* Review Update Button - for admin/owner */}
              {isOwnerOrAdmin && task.pendingUpdates && task.pendingUpdates.length > 0 && (
                <button
                  onClick={() => onReviewUpdate(task)}
                  className="rounded p-2 text-blue-600 transition-colors hover:cursor-pointer hover:bg-gray-500"
                  title="Review Update"
                >
                  <GitPullRequest className="h-4 w-4 hover:cursor-pointer" />
                </button>
              )}

              {/* Edit Button - for admin/owner */}
              {isOwnerOrAdmin && (
                <button
                  onClick={() => onEdit(task)}
                  className="rounded p-2 opacity-80 transition-colors hover:cursor-pointer hover:bg-gray-500"
                  title="Edit Task"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}

              {/* Delete Button - for admin/owner */}
              {isOwnerOrAdmin && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="rounded p-2 text-red-600 transition-colors hover:cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        task={task}
        phaseName={phaseName}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default TaskCard;
