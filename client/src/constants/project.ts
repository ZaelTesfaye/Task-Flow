export type TaskStatus = "active" | "complete" | "canceled";
export type UserRole = "owner" | "admin" | "member";
export type MemberFilter = "all" | "owner" | "admin" | "member";
export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  complete:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  owner:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  admin:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  member:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
};

export const MEMBER_FILTER_OPTIONS: { value: MemberFilter; label: string }[] = [
  { value: "all", label: "All Members" },
  { value: "owner", label: "Owners" },
  { value: "admin", label: "Admins" },
  { value: "member", label: "Members" },
];

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "complete", label: "Complete" },
  { value: "canceled", label: "Canceled" },
];

export const ACCESS_LEVEL_OPTIONS = [
  { value: "member" as const, label: "Member" },
  { value: "admin" as const, label: "Admin" },
];

export const INVITATION_STATUS_COLORS: Record<InvitationStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  accepted:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  declined: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  expired: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

export const DEFAULT_MODAL_STATE = {
  showCategoryModal: false,
  showTaskModal: false,
  showEditTaskModal: false,
  showMembersModal: false,
  showAddMemberModal: false,
  showDeleteProjectModal: false,
  showDeleteTaskModal: false,
  showUpdateTaskModal: false,
  showReviewUpdateModal: false,
  showDeleteCategoryModal: false,
  showRemoveMemberModal: false,
};

export const DEFAULT_FORM_STATE = {
  projectTitle: "",
  projectDescription: "",
  categoryName: "",
  taskTitle: "",
  taskDescription: "",
  taskAssignee: "",
  editTaskTitle: "",
  editTaskDescription: "",
  newMemberEmail: "",
  newMemberAccess: "member" as "admin" | "member",
  updateDescription: "",
  updateStatus: "active" as TaskStatus,
  memberFilter: "all" as MemberFilter,
  selectedCategory: null as any,
  categoryToDelete: null as any,
  taskToDelete: null as any,
  memberToRemove: null as any,
  editingTask: null as any,
  reviewingTask: null as any,
};
