import React from "react";
import { Modal } from "@/components/modals";
import { DEFAULT_FORM_STATE } from "@/constants";
import { TaskStatus } from "@/types";
interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  forms: any;
  updateForm: (key: any, value: any) => void;
  resetForm: (key: keyof typeof DEFAULT_FORM_STATE) => void;
  updateTask: (
    taskId: string,
    data: { title: string; description: string }
  ) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  isOwnerOrAdmin: boolean;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  forms,
  updateForm,
  resetForm,
  updateTask,
  updateTaskStatus,
  isOwnerOrAdmin,
}) => {
  const handleClose = () => {
    onClose();
    resetForm("editingTask");
    resetForm("editTaskTitle");
    resetForm("editTaskDescription");
    resetForm("editTaskStatus");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forms.editingTask) {
      updateTask(forms.editingTask.id, {
        title: forms.editTaskTitle,
        description: forms.editTaskDescription,
      });
      // Update task status if it changed
      if (forms.editTaskStatus !== forms.editingTask.status) {
        updateTaskStatus(forms.editingTask.id, forms.editTaskStatus);
      }
      handleClose(); // Close modal after update
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">
        Edit Task
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            Title
          </label>
          <input
            type="text"
            value={forms.editTaskTitle}
            onChange={(e) => updateForm("editTaskTitle", e.target.value)}
            required
            className="w-full px-4 py-2  rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:outline-none focus:border-transparent outline outline-1 bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            Description
          </label>
          <textarea
            value={forms.editTaskDescription}
            onChange={(e) => updateForm("editTaskDescription", e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]  outline-1 focus:border-transparent outline resize-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
          />
        </div>
        {isOwnerOrAdmin && (
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Status
            </label>
            <select
              value={forms.editTaskStatus}
              onChange={(e) =>
                updateForm(
                  "editTaskStatus",
                  e.target.value as "active" | "complete" | "canceled"
                )
              }
              className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
            >
              <option value="active">Active</option>
              <option value="complete">Complete</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))] hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:bg-blue-700 hover:cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
