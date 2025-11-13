import type {
  TaskStatus,
  UserRole,
  MemberFilter,
  InvitationStatus,
} from "@/types/index";

export {
  type TaskStatus,
  type UserRole,
  type MemberFilter,
  type InvitationStatus,
} from "@/types/index";

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  active:
    "bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-600 dark:border-blue-800/60",
  complete:
    "bg-green-500 text-white border border-green-600 dark:bg-green-900/30 dark:text-green-600 dark:border-green-800/60",
  canceled:
    "bg-red-500 text-white border border-red-600 dark:bg-red-900/30 dark:text-red-600 dark:border-red-800/60",
};

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  owner:
    "bg-yellow-500 text-white border border-yellow-600 dark:bg-yellow-900/30  dark:text-yellow-600 dark:border-yellow-800",
  admin:
    "bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-600 dark:border-blue-800",
  member:
    "bg-green-500 text-white border border-green-600 dark:bg-green-900/30 dark:text-green-600 dark:border-green-800",
};

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
    "bg-yellow-200  border border-yellow-300 dark:bg-yellow-900/10 dark:text-yellow-900 dark:border-yellow-800/60",
  accepted:
    "bg-green-200 text-green-900 border border-green-300 dark:bg-green-900/40 dark:text-green-500 dark:border-green-800/60",
  declined:
    "bg-red-200 text-red-900 border border-red-300 dark:bg-red-900/40 dark:text-red-500 dark:border-red-800/60",
  expired:
    "bg-gray-200 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
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
  editTaskStatus: "active" as TaskStatus,
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
