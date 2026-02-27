import React, { useState } from "react";
import { X, UserPlus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { MemberFilter, Project, ProjectInvitation, ProjectMember, UserRole } from "@/types";

export interface MembersPaneProps {
  members: ProjectMember[];
  project: Project;
  userRole: UserRole;
  memberFilter: MemberFilter;
  invitations: ProjectInvitation[];
  onFilterChange: (filter: MemberFilter) => void;
  onAddMember: () => void;
  onViewAllMembers: () => void;
  onManageInvitations: () => void;
  onRefresh: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const MembersPane: React.FC<MembersPaneProps> = ({
  members,
  project,
  userRole,
  memberFilter,
  onFilterChange,
  onAddMember,
  onViewAllMembers,
  invitations,
  onRefresh,
  isOpen,
  onClose,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("Members list refreshed!");
    } catch {
      toast.error("Failed to refresh members");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    if (memberFilter === "all") return true;
    if (memberFilter === "owner") return member.userId === project?.ownerId;
    if (memberFilter === "admin") return member.access === "admin";
    if (memberFilter === "member") return member.access === "member";
    return true;
  });

  const MEMBER_FILTER_OPTIONS: { value: MemberFilter; label: string }[] = [
    { value: "all", label: "All Members" },
    { value: "owner", label: "Owners" },
    { value: "admin", label: "Admins" },
    { value: "member", label: "Members" },
  ];

  return (
    <div
      className={`fixed right-0 top-[72px] z-40 h-full w-80 transform border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
            <span>Members ({filteredMembers.length})</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-lg p-2 transition hover:bg-[hsl(var(--accent))] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Members"
            >
              <RefreshCw className={`h-4 w-4 hover:cursor-pointer ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-[hsl(var(--accent))]"
              title="Close Members"
            >
              <X className="h-4 w-4 hover:cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Member Filter */}
        <div className="mb-4">
          <select
            value={memberFilter}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-3 py-2 text-sm text-[hsl(var(--foreground))] outline-none focus:border-transparent focus:ring-2 focus:ring-[hsl(var(--ring))]"
          >
            {MEMBER_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Member list */}
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{member.user.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs capitalize ${
                    member.access === "owner"
                      ? "badge-role-owner"
                      : member.access === "admin"
                        ? "badge-role-admin"
                        : "badge-role-member"
                  }`}
                >
                  {member.access}
                </span>
              </div>
            </div>
          ))}
        </div>

        {userRole === "owner" && (
          <button
            onClick={onAddMember}
            className="mt-4 w-full rounded-lg bg-[hsl(var(--primary))] px-3 py-2 text-[hsl(var(--primary-foreground))] transition hover:cursor-pointer hover:brightness-110"
          >
            <UserPlus className="mr-2 inline h-4 w-4" />
            Invite Member
          </button>
        )}

        <button
          onClick={onViewAllMembers}
          className="mt-2 w-full rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-[hsl(var(--foreground))] transition hover:cursor-pointer hover:bg-[hsl(var(--accent))]"
        >
          View All Members
        </button>

        {(userRole === "owner" || userRole === "admin") && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Pending Invitations ({invitations.length})
              </h4>
            </div>

            {invitations.length === 0 ? (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">No pending invitations</p>
            ) : (
              <div className="max-h-32 space-y-2 overflow-y-auto pr-1">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--input))] p-2 text-xs"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-[hsl(var(--foreground))]">{invitation.email}</span>
                      <span
                        className={`${
                          invitation.status === "pending"
                            ? "badge-invitation-pending"
                            : invitation.status === "accepted"
                              ? "badge-invitation-accepted"
                              : invitation.status === "declined"
                                ? "badge-invitation-declined"
                                : "badge-invitation-expired"
                        } rounded-full px-2 py-0.5 capitalize`}
                      >
                        {invitation.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                      <span className="capitalize">Role: {invitation.access}</span>
                      {invitation.inviter && <span>Invited by {invitation.inviter.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPane;
