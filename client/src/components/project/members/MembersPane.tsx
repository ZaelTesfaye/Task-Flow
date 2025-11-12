import React from "react";
import { X, UserPlus } from "lucide-react";
import { MembersPaneProps } from "@/types/component.type";
import { MemberFilter } from "@/types/index";
import {
  ROLE_BADGE_COLORS,
  INVITATION_STATUS_COLORS,
} from "@/constants/project";

const MembersPane: React.FC<MembersPaneProps> = ({
  members,
  project,
  userRole,
  memberFilter,
  onFilterChange,
  onAddMember,
  onViewAllMembers,
  invitations,
  isOpen,
  onClose,
}) => {
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
      className={`fixed right-0 top-18 h-full w-80 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-l border-[hsl(var(--border))] shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[hsl(var(--foreground))]">
            <span>Members ({filteredMembers.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition"
            title="Close Members"
          >
            <X className="w-4 h-4 hover:cursor-pointer" />
          </button>
        </div>

        {/* Member Filter */}
        <div className="mb-4">
          <select
            value={memberFilter}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--input))] text-[hsl(var(--foreground))] text-sm"
          >
            {MEMBER_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Member list */}
        <div className="space-y-3 overflow-y-auto max-h-96">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border border-[hsl(var(--border))] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 font-semibold text-white bg-blue-600 rounded-full">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {member.user.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs capitalize flex items-center gap-1 text-gray-700 dark:text-gray-300 ${
                    ROLE_BADGE_COLORS[member.access]
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
            className="w-full mt-4 px-3 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:brightness-110 transition hover:cursor-pointer"
          >
            <UserPlus className="inline w-4 h-4 mr-2" />
            Add Member
          </button>
        )}

        <button
          onClick={onViewAllMembers}
          className="w-full mt-2 px-3 py-2 border border-[hsl(var(--border))] rounded-lg transition hover:cursor-pointer hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
        >
          View All Members
        </button>

        {(userRole === "owner" || userRole === "admin") && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Pending Invitations ({invitations.length})
              </h4>
            </div>

            {invitations.length === 0 ? (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                No pending invitations
              </p>
            ) : (
              <div className="pr-1 space-y-2 overflow-y-auto max-h-32">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-2 border border-[hsl(var(--border))] rounded-lg text-xs bg-[hsl(var(--input))]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[hsl(var(--foreground))]">
                        {invitation.email}
                      </span>
                      <span
                        className={`${
                          INVITATION_STATUS_COLORS[invitation.status]
                        } px-2 py-0.5 rounded-full capitalize`}
                      >
                        {invitation.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                      <span className="capitalize">
                        Role: {invitation.access}
                      </span>
                      {invitation.inviter && (
                        <span>Invited by {invitation.inviter.name}</span>
                      )}
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
