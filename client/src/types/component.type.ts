import { TaskStatus } from "@/types/task.type";
import { UserRole } from "@/types/user.type";
import {
  Project,
  CategoryWithTasks,
  ProjectMember,
  ProjectInvitation,
  MemberFilter,
} from "@/types/index";

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
}
export interface ProjectHeaderProps {
  project: Project;
  userRole: UserRole;
  onToggleSettings: () => void;
  isSettingsPaneOpen: boolean;
  onToggleMembers: () => void;
  isMembersPaneOpen: boolean;
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
  onDelete: (task: any) => void;
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
