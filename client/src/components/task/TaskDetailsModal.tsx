import React from "react";
import { X, User, FolderKanban, FileText, AlignLeft } from "lucide-react";

import { Modal } from "@/components/modals";
import { Task, TaskStatus } from "@/types";
import { TASK_STATUS_COLORS } from "./TaskCard";

export interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  phaseName: string;
  currentUserId: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  phaseName,
  currentUserId,
}) => {
  if (!task) return null;

  const assigneeName =
    task.assignedTo === currentUserId
      ? "You"
      : task.assignedUser?.name || "Unknown";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
          >
            <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Phase */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <FolderKanban className="w-4 h-4" />
            <span>Phase</span>
          </div>
          <p className="text-[hsl(var(--foreground))] pl-6">{phaseName}</p>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <FileText className="w-4 h-4" />
            <span>Title</span>
          </div>
          <p className="text-[hsl(var(--foreground))] pl-6 font-medium">
            {task.title}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <AlignLeft className="w-4 h-4" />
            <span>Description</span>
          </div>
          <p className="text-[hsl(var(--foreground))] pl-6 whitespace-pre-wrap">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Assigned To */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <User className="w-4 h-4" />
            <span>Assigned To</span>
          </div>
          <p className="text-[hsl(var(--foreground))] pl-6">{assigneeName}</p>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <span className="w-4 h-4 flex items-center justify-center">●</span>
            <span>Status</span>
          </div>
          <div className="pl-6">
            <span
              className={`px-3 py-1 capitalize rounded-full text-sm font-medium ${
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
            className="w-full py-2 px-4 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 text-[hsl(var(--foreground))] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
