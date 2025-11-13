import React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Modal } from "@/components/modals";
import { ProjectMember, ProjectInvitation, Project } from "@/types";
import { UserRole } from "@/types";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ProjectMember[];
  project: Project;
  userRole: UserRole;
  invitations: ProjectInvitation[];
  onAddMember: () => void;
  onUpdateMemberAccess: (userId: string, access: "admin" | "member") => void;
  onRemoveMember: (userId: string, memberName: string) => void;
  updateForm: (key: any, value: any) => void;
  openModal: (
    key: keyof typeof import("@/constants/project").DEFAULT_MODAL_STATE
  ) => void;
}

const MembersModal: React.FC<MembersModalProps> = ({
  isOpen,
  onClose,
  members,
  project,
  userRole,
  onAddMember,
  onUpdateMemberAccess,
  updateForm,
  openModal,
}) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Project Members
        </h2>
      </div>

      {/* Members list */}
      <div className="space-y-3 overflow-y-auto max-h-96">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))]"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-blue-600 rounded-full">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">
                  {member.user.name}
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {member.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {userRole === "owner" && member.userId !== project?.ownerId ? (
                <select
                  value={member.access}
                  onChange={(e) =>
                    onUpdateMemberAccess(
                      member.userId,
                      e.target.value as "admin" | "member"
                    )
                  }
                  className="px-3 py-1 border border-[hsl(var(--input))] rounded-lg text-sm outline-none bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span className="px-3 py-1 bg-[hsl(var(--accent))] rounded-full text-sm capitalize flex items-center gap-1 text-[hsl(var(--foreground))]">
                  {member.userId === project?.ownerId ? "Owner" : member.access}
                </span>
              )}

              {userRole === "owner" && member.userId !== project?.ownerId && (
                <button
                  onClick={() => {
                    updateForm("memberToRemove", {
                      id: member.userId,
                      name: member.user.name,
                    });
                    openModal("showRemoveMemberModal");
                  }}
                  className="p-2 text-red-600 transition rounded hover:cursor-pointer dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="hover:cursor-pointer w-full mt-6 px-4 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition text-[hsl(var(--foreground))]"
      >
        Close
      </button>
    </Modal>
  );
};

export default MembersModal;
