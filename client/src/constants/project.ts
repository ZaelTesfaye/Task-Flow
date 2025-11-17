import type {
  TaskStatus,
  UserRole,
  MemberFilter,
  InvitationStatus,
} from "@/types";

export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  owner:
    "bg-yellow-500/10 text-yellow-500 border border-yellow-600 dark:bg-yellow-900/10 dark:text-yellow-500 dark:border-yellow-500",
  admin:
    "bg-blue-500/10 text-blue-500 border border-blue-600 dark:bg-blue-900/10 dark:text-blue-500 dark:border-blue-800",
  member:
    "bg-green-500/10 text-green-500 border border-green-600 dark:bg-green-900/10 dark:text-green-500 dark:border-green-700",
};

export const INVITATION_STATUS_COLORS: Record<InvitationStatus, string> = {
  pending:
    "bg-yellow-500  border border-yellow-300 dark:bg-yellow-900/10 dark:text-yellow-500 dark:border-yellow-800/60",
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
  showLeaveProjectModal: false,
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
