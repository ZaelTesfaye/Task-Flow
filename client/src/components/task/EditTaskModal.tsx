import React from "react";
import { Modal, Spinner } from "@/components";
import { DEFAULT_FORM_STATE } from "@/constants";
import { TaskStatus } from "@/types";
interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  forms: any;
  updateForm: (key: any, value: any) => void;
  resetForm: (key: keyof typeof DEFAULT_FORM_STATE) => void;
  updateTask: (taskId: string, data: { title: string; description: string }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  isOwnerOrAdmin: boolean;
  loading?: boolean;
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
  loading = false,
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
      <h2 className="mb-6 text-2xl font-bold text-[hsl(var(--foreground))]">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Title</label>
          <input
            type="text"
            value={forms.editTaskTitle}
            onChange={(e) => updateForm("editTaskTitle", e.target.value)}
            required
            className="w-full rounded-lg bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline outline-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Description</label>
          <textarea
            value={forms.editTaskDescription}
            onChange={(e) => updateForm("editTaskDescription", e.target.value)}
            required
            rows={3}
            className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline outline-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        {isOwnerOrAdmin && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Status</label>
            <select
              value={forms.editTaskStatus}
              onChange={(e) => updateForm("editTaskStatus", e.target.value as "active" | "complete" | "canceled")}
              className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
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
            disabled={loading}
            className="flex-1 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-[hsl(var(--foreground))] transition hover:cursor-pointer hover:bg-[hsl(var(--accent))] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Updating...</span>
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
