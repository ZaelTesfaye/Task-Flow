import React, { useState } from "react";
import { X } from "lucide-react";
import { Modal, Spinner } from "@/components";

export interface CreatePhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

const CreatePhaseModal: React.FC<CreatePhaseModalProps> = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [phaseName, setPhaseName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName.trim()) return;

    try {
      await onSubmit(phaseName.trim());
      setPhaseName("");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setPhaseName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Create Phase</h2>
        <button
          onClick={handleClose}
          className="rounded-lg p-2 transition hover:cursor-pointer hover:bg-[hsl(var(--muted))]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--muted-foreground))]">Phase Name</label>
          <input
            type="text"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
            required
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="Planning, Development, Testing..."
          />
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
            disabled={loading || !phaseName.trim()}
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

export default CreatePhaseModal;
