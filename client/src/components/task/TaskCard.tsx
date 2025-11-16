import React from "react";
import {
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  GitPullRequest,
  ArrowUpFromLine,
} from "lucide-react";
import { TASK_STATUS_COLORS } from "@/constants";
import { TaskStatus, UserRole } from "@/types";

export interface TaskCardProps {
  task: any;
  userRole: UserRole;
  currentUserId: string;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onRequestUpdate: (
    taskId: string,
    description: string,
    status: TaskStatus
  ) => void;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
  onReviewUpdate: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  currentUserId,
  onRequestUpdate,
  onEdit,
  onDelete,
  onReviewUpdate,
}) => {
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";

  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-[hsl(var(--border))]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                task.status === "complete"
                  ? "bg-green-500"
                  : task.status === "canceled"
                  ? "bg-red-500"
                  : "border-2 border-gray-300 dark:border-gray-500"
              }`}
            >
              {task.status === "complete" && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
              {task.status === "canceled" && (
                <XCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <h4
              className={`font-medium text-sm truncate text-[hsl(var(--foreground))] ${
                task.status === "complete"
                  ? "opacity-60 line-through"
                  : task.status === "canceled"
                  ? "text-red-500 line-through"
                  : ""
              }`}
            >
              {task.title}
            </h4>
          </div>

          {/* Status and Pending Updates */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 capitalize rounded-full text-xs font-medium ${
                TASK_STATUS_COLORS[
                  task.status as keyof typeof TASK_STATUS_COLORS
                ]
              }`}
            >
              {task.status}
            </span>
            {task.pendingUpdates && task.pendingUpdates.length > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-yellow-900 bg-yellow-200 border border-yellow-300 rounded-full dark:bg-yellow-900/30 dark:text-yellow-600 dark:border-yellow-800/60">
                {task.pendingUpdates.length} pending
              </span>
            )}
          </div>
        </div>

        {/* Assigned User & Action Buttons */}
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-xs text-right truncate opacity-70 max-w-20 text-[hsl(var(--muted-foreground))]">
            To: {task.assignedUser?.name}
          </span>
          <div className="flex items-center gap-0">
            {/* Request Update Button - for assigned user only */}
            {task.assignedTo === currentUserId && !isOwnerOrAdmin && (
              <button
                onClick={() => onRequestUpdate(task.id, "", task.status)}
                className="p-2 transition-colors rounded hover:bg-gray-500 hover:cursor-pointer opacity-80"
                title="Request Status Update"
              >
                <ArrowUpFromLine className="w-4 h-4 " />
              </button>
            )}

            {/* Review Update Button - for admin/owner */}
            {isOwnerOrAdmin &&
              task.pendingUpdates &&
              task.pendingUpdates.length > 0 && (
                <button
                  onClick={() => onReviewUpdate(task)}
                  className="p-2 text-blue-600 transition-colors rounded hover:cursor-pointer hover:bg-gray-500"
                  title="Review Update"
                >
                  <GitPullRequest className="w-4 h-4 hover:cursor-pointer" />
                </button>
              )}

            {/* Edit Button - for admin/owner */}
            {isOwnerOrAdmin && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 transition-colors rounded hover:bg-gray-500 hover:cursor-pointer opacity-80"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {/* Delete Button - for admin/owner */}
            {isOwnerOrAdmin && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 transition-colors rounded hover:cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
