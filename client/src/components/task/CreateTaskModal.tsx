import React, { useState } from "react";
import { X } from "lucide-react";

import { Modal, Spinner } from "@/components";
import { PhaseWithTasks, ProjectMember } from "@/types";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; assignee: string }) => void;
  selectedPhase: PhaseWithTasks | null;
  members: ProjectMember[];
  loading?: boolean;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedPhase,
  members,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
  });

  const currentAssignee = formData.assignee || (members.length > 0 ? members[0].userId : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidAssignee = members.some((m) => m.userId === currentAssignee);
    if (!formData.title.trim() || !formData.description.trim() || !isValidAssignee) return;

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignee: currentAssignee,
      });
      setFormData({ title: "", description: "", assignee: "" });
      onClose();
    } catch {
      // Error is handled by the parent component
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", assignee: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Create Task</h2>
        <button
          onClick={handleClose}
          className="rounded-lg p-2 transition hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {selectedPhase && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Creating task in: <span className="font-medium text-[hsl(var(--foreground))]">{selectedPhase.name}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--muted-foreground))]">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--muted-foreground))]">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            required
            rows={3}
            className="w-full resize-none rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--muted-foreground))]">Assign To</label>
          <select
            value={currentAssignee}
            onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
            required
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            {members.map((member) => (
              <option key={member.userId} value={member.userId} className="py-2">
                {member.user.name} - {member.user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-[hsl(var(--foreground))] transition hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              !formData.title.trim() ||
              !formData.description.trim() ||
              !members.some((m) => m.userId === currentAssignee)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Creating...</span>
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
