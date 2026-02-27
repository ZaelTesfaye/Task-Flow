import React from "react";
import { Modal } from "@/components/modals";
import { Spinner } from "@/components/ui";

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
      <h2 className="text-2xl font-bold mb-6 text-[hsl(var(--foreground))]">
        Invite Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            Email
          </label>
          <input
            type="email"
            value={forms.newMemberEmail}
            onChange={(e) => updateForm("newMemberEmail", e.target.value)}
            required
            className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
            placeholder="member@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
            Role
          </label>
          <select
            value={forms.newMemberAccess}
            onChange={(e) =>
              updateForm(
                "newMemberAccess",
                e.target.value as "admin" | "member"
              )
            }
            className="w-full px-4 py-2 border border-[hsl(var(--input))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
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
            className="hover:cursor-pointer flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 text-[hsl(var(--primary-foreground))] transition bg-blue-600 rounded-lg hover:cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
