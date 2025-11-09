import {
  TaskStatus,
  UserRole,
  MemberFilter,
  InvitationStatus,
} from "@/constants/project";
import {
  Project,
  CategoryWithTasks,
  ProjectMember,
  TasksResponse,
  CreateCategoryRequest,
  CreateTaskRequest,
  UpdateProjectRequest,
  AddMemberRequest,
  UpdateMemberRequest,
  UpdateTaskRequest,
  RequestUpdateRequest,
  AcceptUpdateRequest,
  ProjectInvitation,
} from "@/types/api";

// Re-export types from constants
export type { TaskStatus, UserRole, MemberFilter };
export type { InvitationStatus };

export interface TaskStatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

export interface ProjectHeaderProps {
  project: Project;
  userRole: UserRole;
  onToggleSettings: () => void;
  onToggleMembers: () => void;
  isMembersPaneOpen: boolean;
  isSettingsPaneOpen: boolean;
}

export interface CategoryCardProps {
  category: CategoryWithTasks;
  userRole: UserRole;
  onCreateTask: (category: CategoryWithTasks) => void;
  onDeleteCategory: (categoryId: string, categoryName: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onRequestUpdate: (
    taskId: string,
    description: string,
    status: TaskStatus
  ) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (taskId: string) => void;
  onReviewUpdate: (task: any) => void;
  currentUserId: string;
}

export interface MembersPaneProps {
  members: ProjectMember[];
  project: Project;
  userRole: UserRole;
  memberFilter: MemberFilter;
  invitations: ProjectInvitation[];
  onFilterChange: (filter: MemberFilter) => void;
  onAddMember: () => void;
  onRemoveMember: (userId: string, memberName: string) => void;
  onPromoteMember: (userId: string, newAccess: "admin" | "member") => void;
  onViewAllMembers: () => void;
  onManageInvitations: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface TaskCardProps {
  task: any;
  userRole: UserRole;
  currentUserId: string;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onRequestUpdate: (
    taskId: string,
    description: string,
    status: TaskStatus
  ) => void;
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onReviewUpdate: (task: any) => void;
}

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    assignee: string;
  }) => void;
  selectedCategory: CategoryWithTasks | null;
  members: ProjectMember[];
  loading?: boolean;
}

export interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
  task: any;
  loading?: boolean;
}

export interface ProjectSettingsPaneProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void | Promise<void>;
  onDelete: () => void;
  isSaving?: boolean;
}

export interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ProjectMember[];
  project: Project;
  userRole: UserRole;
  onPromoteMember: (userId: string, newAccess: "admin" | "member") => void;
  onRemoveMember: (userId: string, memberName: string) => void;
  onAddMember: () => void;
}

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; access: "admin" | "member" }) => void;
  loading?: boolean;
}

export interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, status: TaskStatus) => void;
  loading?: boolean;
}

export interface ReviewUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (pendingUpdateId: string, newStatus: TaskStatus) => void;
  task: any;
  loading?: boolean;
}

// Re-export API types for convenience
export type {
  Project,
  CategoryWithTasks,
  ProjectMember,
  TasksResponse,
  CreateCategoryRequest,
  CreateTaskRequest,
  UpdateProjectRequest,
  AddMemberRequest,
  UpdateMemberRequest,
  UpdateTaskRequest,
  RequestUpdateRequest,
  AcceptUpdateRequest,
};
