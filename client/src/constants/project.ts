import type { TaskStatus, MemberFilter } from "@/types";

export const DEFAULT_MODAL_STATE = {
  showPhaseModal: false,
  showTaskModal: false,
  showEditTaskModal: false,
  showMembersModal: false,
  showAddMemberModal: false,
  showDeleteProjectModal: false,
  showDeleteTaskModal: false,
  showUpdateTaskModal: false,
  showReviewUpdateModal: false,
  showDeletePhaseModal: false,
  showRemoveMemberModal: false,
  showLeaveProjectModal: false,
};

export const DEFAULT_FORM_STATE = {
  projectTitle: "",
  projectDescription: "",
  phaseName: "",
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
  selectedPhase: null as any,
  phaseToDelete: null as any,
  taskToDelete: null as any,
  memberToRemove: null as any,
  editingTask: null as any,
  reviewingTask: null as any,
};
