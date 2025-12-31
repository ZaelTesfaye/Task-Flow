import { Modal } from "@/components/modals";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  name,
  onNameChange,
  onSubmit,
}: EditProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-2xl font-bold">Edit Profile</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-4 outline-1 focus:outline-none  py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:brightness-110 transition hover:cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
