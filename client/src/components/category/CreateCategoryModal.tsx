import React, { useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/modals";

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await onSubmit(categoryName.trim());
      setCategoryName("");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Create Category
        </h2>
        <button
          onClick={handleClose}
          className="p-2 transition rounded-lg hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full px-4 py-2 text-[hsl(var(--foreground))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="To Do, In Progress, Done..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-[hsl(var(--foreground))] transition border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--muted))] hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !categoryName.trim()}
            className="flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCategoryModal;
