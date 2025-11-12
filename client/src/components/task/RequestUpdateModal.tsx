import React from "react";
import Modal from "@/components/modals/Modal";

interface RequestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  updateDescription: string;
  updateStatus: string;
  onUpdateDescriptionChange: (value: string) => void;
  onUpdateStatusChange: (value: string) => void;
}

const RequestUpdateModal: React.FC<RequestUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  updateDescription,
  updateStatus,
  onUpdateDescriptionChange,
  onUpdateStatusChange,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">
        Request Task Update
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            Update Description
          </label>
          <textarea
            value={updateDescription}
            onChange={(e) => onUpdateDescriptionChange(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none resize-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
            placeholder="Describe the changes you want to make..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            New Status
          </label>
          <select
            value={updateStatus}
            onChange={(e) => onUpdateStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
          >
            <option value="active">Active</option>
            <option value="complete">Complete</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="hover:cursor-pointer duration-200 hover:bg-gray-500 flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg transition text-[hsl(var(--foreground))]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-700"
          >
            Request Update
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestUpdateModal;
