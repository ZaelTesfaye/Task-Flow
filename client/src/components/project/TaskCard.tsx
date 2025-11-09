import React from 'react';
import { CheckCircle, Circle, XCircle, Clock, Edit2, Trash2, Eye } from 'lucide-react';
import { TaskCardProps } from '@/types/project';
import { TASK_STATUS_COLORS } from '@/constants/project';
import TaskStatusSelect from './TaskStatusSelect';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  currentUserId,
  onUpdateStatus,
  onRequestUpdate,
  onEdit,
  onDelete,
  onReviewUpdate,
}) => {
  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'canceled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
  <div className="p-3 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--secondary))] rounded-lg border border-[hsl(var(--border))]">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
            task.status === 'complete'
              ? 'bg-green-500'
              : task.status === 'canceled'
              ? 'bg-red-500'
              : 'border-2 border-gray-300 dark:border-gray-500'
          }`}>
            {task.status === 'complete' && <CheckCircle className="w-3 h-3 text-white" />}
            {task.status === 'canceled' && <XCircle className="w-3 h-3 text-white" />}
          </div>
          <h4 className={`font-medium text-sm truncate ${
            task.status === 'complete'
              ? 'opacity-60 line-through'
              : task.status === 'canceled'
              ? 'text-red-500 line-through'
              : ''
          }`}>
            {task.title}
          </h4>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
            {task.assignedUser?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs opacity-70 truncate max-w-16">
            {task.assignedUser?.name}
          </span>
        </div>
      </div>

      {/* Status and Pending Updates */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[task.status as keyof typeof TASK_STATUS_COLORS]}`}>
            {task.status}
          </span>
          {task.pendingUpdates && task.pendingUpdates.length > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium">
              {task.pendingUpdates.length} pending
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1">
        {/* Request Update Button - for assigned user */}
        {task.assignedTo === currentUserId && (
          <button
            onClick={() => onRequestUpdate(task.id, '', task.status)}
            className="p-1 hover:bg-[hsl(var(--accent))] rounded opacity-80"
            title="Request Update"
          >
            <Clock className="w-3 h-3" />
          </button>
        )}

        {/* Review Update Button - for admin/owner */}
        {isOwnerOrAdmin && task.pendingUpdates && task.pendingUpdates.length > 0 && (
          <button
            onClick={() => onReviewUpdate(task)}
            className="p-1 hover:bg-[hsl(var(--accent))] rounded text-blue-600"
            title="Review Update"
          >
            <Eye className="w-3 h-3" />
          </button>
        )}

        {/* Edit Button - for admin/owner */}
        {isOwnerOrAdmin && (
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-[hsl(var(--accent))] rounded opacity-80"
            title="Edit Task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}

        {/* Delete Button - for admin/owner */}
        {isOwnerOrAdmin && (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;