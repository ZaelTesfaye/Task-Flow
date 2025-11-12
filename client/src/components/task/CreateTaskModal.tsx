import React, { useState } from "react";
import { X } from "lucide-react";
import Modal from "@/components/modals/Modal";
import { CreateTaskModalProps } from "@/types/component.type";

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedCategory,
  members,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.assignee
    )
      return;

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignee: formData.assignee,
      });
      setFormData({ title: "", description: "", assignee: "" });
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", assignee: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Create Task
        </h2>
        <button
          onClick={handleClose}
          className="p-2 transition rounded-lg hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {selectedCategory && (
        <div className="p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Creating task in:{" "}
            <span className="font-medium text-[hsl(var(--foreground))]">
              {selectedCategory.name}
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            className="w-full px-4 py-2 text-[hsl(var(--foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            rows={3}
            className="w-full px-4 py-2 text-[hsl(var(--foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Assign To
          </label>
          <select
            value={formData.assignee}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, assignee: e.target.value }))
            }
            required
            className="w-full px-4 py-2 text-[hsl(var(--foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select member...</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.name} ({member.access})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-[hsl(var(--foreground))] transition border border-[hsl(var(--border))] rounded-lg hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              !formData.title.trim() ||
              !formData.description.trim() ||
              !formData.assignee
            }
            className="flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg  hover:cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
