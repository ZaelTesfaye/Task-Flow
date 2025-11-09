import React from 'react';
import { X, Crown, UserPlus } from 'lucide-react';
import { MembersPaneProps } from '@/types/project';
import { MEMBER_FILTER_OPTIONS, ROLE_BADGE_COLORS, INVITATION_STATUS_COLORS } from '@/constants/project';

const MembersPane: React.FC<MembersPaneProps> = ({
  members,
  project,
  userRole,
  memberFilter,
  onFilterChange,
  onAddMember,
  onRemoveMember,
  onPromoteMember,
  onViewAllMembers,
  onManageInvitations,
  invitations,
  isOpen,
  onClose,
}) => {
  const filteredMembers = members.filter((member) => {
    if (memberFilter === 'all') return true;
    if (memberFilter === 'owner') return member.userId === project?.ownerId;
    if (memberFilter === 'admin') return member.access === 'admin';
    if (memberFilter === 'member') return member.access === 'member';
    return true;
  });

  return (
    <div className={`fixed right-0 top-18 h-full w-80 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-l border-[hsl(var(--border))] shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <span>Members ({filteredMembers.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--accent))] rounded-lg transition"
            title="Close Members"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Member Filter */}
        <div className="mb-4">
          <select
            value={memberFilter}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-lg focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent outline-none bg-[hsl(var(--input))] text-[hsl(var(--foreground))] text-sm"
          >
            {MEMBER_FILTER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border border-[hsl(var(--border))] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{member.user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userRole === 'owner' && member.userId !== project?.ownerId ? (
                  <select
                    value={member.access}
                    onChange={(e) => onPromoteMember(member.userId, e.target.value as 'admin' | 'member')}
                    className="px-2 py-1 border border-[hsl(var(--border))] rounded text-xs outline-none bg-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs capitalize flex items-center gap-1 text-gray-700 dark:text-gray-300 ${ROLE_BADGE_COLORS[member.userId === project?.ownerId ? 'owner' : member.access]}`}>
                    {member.userId === project?.ownerId && <Crown className="w-3 h-3 text-yellow-500" />}
                    {member.userId === project?.ownerId ? 'Owner' : member.access}
                  </span>
                )}

                {userRole === 'owner' && member.userId !== project?.ownerId && (
                  <button
                    onClick={() => onRemoveMember(member.userId, member.user.name)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition"
                    title="Remove Member"
                  >
                    <span className="text-sm">×</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {userRole === 'owner' && (
          <button
            onClick={onAddMember}
            className="w-full mt-4 px-3 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:brightness-110 transition"
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Add Member
          </button>
        )}

        <button
          onClick={onViewAllMembers}
          className="w-full mt-2 px-3 py-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--accent))] transition"
        >
          View All Members
        </button>
        
        {(userRole === 'owner' || userRole === 'admin') && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Pending Invitations ({invitations.length})
              </h4>
              <button
                onClick={onManageInvitations}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage
              </button>
            </div>
            {invitations.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No pending invitations
              </p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-2 border border-[hsl(var(--border))] rounded-lg text-xs bg-[hsl(var(--input))]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {invitation.email}
                      </span>
                      <span
                        className={`${INVITATION_STATUS_COLORS[invitation.status]} px-2 py-0.5 rounded-full capitalize`}
                      >
                        {invitation.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400">
                      <span className="capitalize">Role: {invitation.access}</span>
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