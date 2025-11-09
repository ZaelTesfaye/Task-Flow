// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface AuthResponse {
  user: User;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithMembers extends Project {
  members?: ProjectMember[];
}

export interface CreateProjectRequest {
  title: string;
  description: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}

export interface UserProjectsResponse {
  owner: Project[];
  admin: Project[];
  member: Project[];
}

// Project Member Types
export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  access: "owner" | "admin" | "member";
  user: User;
}

export interface AddMemberRequest {
  email: string;
  access?: "admin" | "member";
}

export interface UpdateMemberRequest {
  access: "admin" | "member";
}

export interface ProjectInvitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired";
  access: "admin" | "member";
  createdAt: string;
  respondedAt?: string | null;
  projectId: string;
  inviter: User;
  invitee?: User | null;
  project?: Project;
}

export interface RespondInvitationRequest {
  action: "accept" | "decline";
}

// Category Types
export interface Category {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "active" | "complete" | "canceled";
  assignedTo: string;
  categoryId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  assignedUser?: User;
  pendingUpdates?: PendingUpdate[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assignedTo: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "active" | "complete" | "canceled";
  categoryId?: string;
}

export interface TasksResponse {
  project: Project;
  categories: CategoryWithTasks[];
}

export interface CategoryWithTasks extends Category {
  tasks: Task[];
}

// Pending Update Types
export interface PendingUpdate {
  id: string;
  taskId: string;
  requestedBy: string;
  updateDescription: string;
  newStatus: "active" | "complete" | "canceled";
  createdAt: string;
}

export interface RequestUpdateRequest {
  updateDescription: string;
  newStatus: "active" | "complete" | "canceled";
}

export interface AcceptUpdateRequest {
  newStatus: "active" | "complete" | "canceled";
}

// Admin Types
export interface AdminUser extends User {
  role: string;
}

export interface UpdateUserRoleRequest {
  role: string;
}

export interface SystemStats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any[];
}
