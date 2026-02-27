import { Modal, Spinner } from "@/components";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  name,
  onNameChange,
  onSubmit,
  loading = false,
}: EditProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-2xl font-bold">Edit Profile</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-4 py-2 text-[hsl(var(--foreground))] outline outline-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-[hsl(var(--border))] px-4 py-2 transition hover:cursor-pointer hover:bg-[hsl(var(--accent))] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner className="text-white" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
