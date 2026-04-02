import React from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "@/components";
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
  openModal: (key: keyof typeof import("@/constants/project").DEFAULT_MODAL_STATE) => void;
}

const MembersModal: React.FC<MembersModalProps> = ({
  isOpen,
  onClose,
  members,
  project,
  userRole,
  onUpdateMemberAccess,
  updateForm,
  openModal,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Project Members</h2>
      </div>

      {/* Members list */}
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">{member.user.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {userRole === "owner" && member.userId !== project?.ownerId ? (
                <select
                  value={member.access}
                  onChange={(e) => onUpdateMemberAccess(member.userId, e.target.value as "admin" | "member")}
                  className="rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-1 text-sm text-[hsl(var(--foreground))] outline-none"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span
                  className={`px-3 py-1 ${
                    member.access === "owner"
                      ? "badge-role-owner"
                      : member.access === "admin"
                        ? "badge-role-admin"
                        : "badge-role-member"
                  } capWitalize flex items-center gap-1 rounded-full text-sm`}
                >
                  {member.access}
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
                  className="rounded p-2 text-red-600 transition hover:cursor-pointer hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-[hsl(var(--foreground))] transition hover:cursor-pointer hover:bg-[hsl(var(--accent))]"
      >
        Close
      </button>
    </Modal>
  );
};

export default MembersModal;
