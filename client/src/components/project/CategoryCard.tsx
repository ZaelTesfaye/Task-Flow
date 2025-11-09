import React from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { CategoryCardProps } from '@/types/project';
import TaskCard from './TaskCard';

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  userRole,
  onCreateTask,
  onDeleteCategory,
  onUpdateTaskStatus,
  onRequestUpdate,
  onEditTask,
  onDeleteTask,
  onReviewUpdate,
  currentUserId,
}) => {
  const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';

  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg border border-[hsl(var(--border))] p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <>
              <button
                onClick={() => onCreateTask(category)}
                className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition text-blue-600 dark:text-blue-400"
                title="Add Task"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(category.id, category.name)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition text-red-600"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
  <div className="flex items-center justify-between text-sm opacity-80">
          <span>{category.tasks?.length || 0} tasks</span>
          <span className="text-xs">
            {category.tasks?.filter(t => t.status === 'complete').length || 0} completed
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {category.tasks?.length === 0 ? (
          <div className="text-center py-8 opacity-70">
            <p className="text-sm">No tasks yet</p>
            {isOwnerOrAdmin && (
              <button
                onClick={() => onCreateTask(category)}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Add first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {category.tasks?.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole={userRole}
                currentUserId={currentUserId}
                onUpdateStatus={onUpdateTaskStatus}
                onRequestUpdate={onRequestUpdate}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onReviewUpdate={onReviewUpdate}
              />
            ))}
            {category.tasks && category.tasks.length > 3 && (
              <p className="text-xs opacity-70 text-center py-1">
                +{category.tasks.length - 3} more tasks
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;