import React from "react";
import { X, User, FolderKanban, FileText, AlignLeft } from "lucide-react";

import { Modal } from "@/components";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_COLORS } from "../task/TaskCard";

export interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  phaseName: string;
  currentUserId: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task, phaseName, currentUserId }) => {
  if (!task) return null;

  const assigneeName = task.assignedTo === currentUserId ? "You" : task.assignedUser?.name || "Unknown";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Task Details</h2>
          <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-[hsl(var(--muted))]">
            <X className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Phase */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <FolderKanban className="h-4 w-4" />
            <span>Phase</span>
          </div>
          <p className="pl-6 text-[hsl(var(--foreground))]">{phaseName}</p>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <FileText className="h-4 w-4" />
            <span>Title</span>
          </div>
          <p className="pl-6 font-medium text-[hsl(var(--foreground))]">{task.title}</p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <AlignLeft className="h-4 w-4" />
            <span>Description</span>
          </div>
          <p className="whitespace-pre-wrap pl-6 text-[hsl(var(--foreground))]">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Assigned To */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <User className="h-4 w-4" />
            <span>Assigned To</span>
          </div>
          <p className="pl-6 text-[hsl(var(--foreground))]">{assigneeName}</p>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <span className="flex h-4 w-4 items-center justify-center">●</span>
            <span>Status</span>
          </div>
          <div className="pl-6">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                TASK_STATUS_COLORS[task.status as TaskStatus]
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-[hsl(var(--muted))] px-4 py-2 font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]/80"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
