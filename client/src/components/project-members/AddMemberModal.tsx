import React from "react";
import { Modal, Spinner } from "@/components";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  forms: any;
  updateForm: (key: any, value: any) => void;
  addMember: (data: { email: string; access: "admin" | "member" }) => void;
  loading?: boolean;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  forms,
  updateForm,
  addMember,
  loading = false,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMember({
      email: forms.newMemberEmail,
      access: forms.newMemberAccess,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-2xl font-bold text-[hsl(var(--foreground))]">Invite Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Email</label>
          <input
            type="email"
            value={forms.newMemberEmail}
            onChange={(e) => updateForm("newMemberEmail", e.target.value)}
            required
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
            placeholder="member@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">Role</label>
          <select
            value={forms.newMemberAccess}
            onChange={(e) => updateForm("newMemberAccess", e.target.value as "admin" | "member")}
            className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 py-2 text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
                <span>Inviting...</span>
              </>
            ) : (
              "Invite Member"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
