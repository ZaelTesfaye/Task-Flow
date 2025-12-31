import React from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { TaskCard } from "@/components/task";
import { PhaseWithTasks, TaskStatus, UserRole } from "@/types";

export interface PhaseCardProps {
  phase: PhaseWithTasks;
  userRole: UserRole;
  onCreateTask: (phase: PhaseWithTasks) => void;
  onDeletePhase: (phaseId: string, phaseName: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onRequestUpdate: (
    taskId: string,
    description: string,
    status: TaskStatus
  ) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onReviewUpdate: (task: any) => void;
  currentUserId: string;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  userRole,
  onCreateTask,
  onDeletePhase,
  onUpdateTaskStatus,
  onRequestUpdate,
  onEditTask,
  onDeleteTask,
  onReviewUpdate,
  currentUserId,
}) => {
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg border border-[hsl(var(--border))] p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
            <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            {phase.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <>
              <button
                onClick={() => onCreateTask(phase)}
                className="p-2 hover:bg-[hsl(var(--accent))] rounded-2xl transition duration-300 text-blue-600 dark:text-blue-400 hover:scale-150 hover:cursor-pointer"
                title="Add Task"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button
                onClick={() => onDeletePhase(phase.id, phase.name)}
                className="p-2 text-red-600 transition rounded-lg hover:scale-110 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
                title="Delete Phase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between text-sm opacity-80 text-[hsl(var(--muted-foreground))]">
          <span>{phase.tasks?.length || 0} tasks</span>
          <span className="text-xs">
            {phase.tasks?.filter((t) => t.status === "complete").length || 0}{" "}
            completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {phase.tasks?.length === 0 ? (
          <div className="py-8 text-center opacity-70">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No tasks yet
            </p>
            {isOwnerOrAdmin && (
              <button
                onClick={() => onCreateTask(phase)}
                className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
              >
                Add first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-96">
            {phase.tasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole={userRole}
                currentUserId={currentUserId}
                phaseName={phase.name}
                onUpdateStatus={onUpdateTaskStatus}
                onRequestUpdate={onRequestUpdate}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onReviewUpdate={onReviewUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseCard;
