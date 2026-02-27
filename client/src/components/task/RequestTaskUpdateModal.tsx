import React from "react";
import { Modal, Spinner } from "@/components";

interface RequestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  updateDescription: string;
  updateStatus: string;
  onUpdateDescriptionChange: (value: string) => void;
  onUpdateStatusChange: (value: string) => void;
  loading?: boolean;
}

const RequestUpdateModal: React.FC<RequestUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  updateDescription,
  updateStatus,
  onUpdateDescriptionChange,
  onUpdateStatusChange,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-2xl font-bold text-[hsl(var(--foreground))]">Request Task Update</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Update Description</label>
          <textarea
            value={updateDescription}
            onChange={(e) => onUpdateDescriptionChange(e.target.value)}
            required
            rows={3}
            className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="Describe the changes you want to make..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">New Status</label>
          <select
            value={updateStatus}
            onChange={(e) => onUpdateStatusChange(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
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
            disabled={loading}
            className="flex-1 rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-[hsl(var(--foreground))] transition duration-200 hover:cursor-pointer hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !updateDescription.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Requesting...</span>
              </>
            ) : (
              "Request Update"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestUpdateModal;
