import axios from "axios";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UserProjectsResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectMember,
  AddMemberRequest,
  UpdateMemberRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  RequestUpdateRequest,
  AcceptUpdateRequest,
  AdminUser,
  UpdateUserRoleRequest,
  SystemStats,
} from "@/types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints
export const authAPI = {
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  logout: (): Promise<ApiResponse<void>> => api.post("/auth/logout"),
};

// User endpoints
export const userAPI = {
  updateUser: (data: UpdateUserRequest): Promise<ApiResponse<any>> =>
    api.patch("/user", data),

  deleteUser: (): Promise<ApiResponse<void>> => api.delete("/user"),
};

// Project endpoints
export const projectAPI = {
  createProject: (data: CreateProjectRequest): Promise<ApiResponse<any>> =>
    api.post("/project", data),

  updateProject: (
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<any>> => api.patch(`/project/${projectId}`, data),

  getUserProjects: (): Promise<ApiResponse<UserProjectsResponse>> =>
    api.get("/project"),

  removeProject: (projectId: string): Promise<ApiResponse<void>> =>
    api.delete(`/project/${projectId}`),

  addMember: (
    projectId: string,
    data: AddMemberRequest
  ): Promise<ApiResponse<any>> =>
    api.post(`/project/member/${projectId}`, data),

  updateMember: (
    projectId: string,
    userId: string,
    data: UpdateMemberRequest
  ): Promise<ApiResponse<void>> =>
    api.patch(`/project/member/${projectId}/${userId}`, data),

  getProjectMembers: (
    projectId: string
  ): Promise<ApiResponse<ProjectMember[]>> =>
    api.get(`/project/member/${projectId}`),

  removeProjectMember: (
    projectId: string,
    userId: string
  ): Promise<ApiResponse<void>> =>
    api.delete(`/project/member/${projectId}/${userId}`),
};

// Category endpoints
export const categoryAPI = {
  createCategory: (
    projectId: string,
    data: CreateCategoryRequest
  ): Promise<ApiResponse<any>> => api.post(`/category/${projectId}`, data),

  updateCategory: (
    projectId: string,
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<any>> =>
    api.patch(`/category/${projectId}/${categoryId}`, data),

  removeCategory: (
    projectId: string,
    categoryId: string
  ): Promise<ApiResponse<void>> =>
    api.delete(`/category/${projectId}/${categoryId}`),
};

// Task endpoints
export const taskAPI = {
  createTask: (
    projectId: string,
    categoryId: string,
    data: CreateTaskRequest
  ): Promise<ApiResponse<any>> =>
    api.post(`/task/${projectId}/${categoryId}`, data),

  getCategories: (projectId: string): Promise<ApiResponse<TasksResponse>> =>
    api.get(`/category/${projectId}`),

  updateTask: (
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<ApiResponse<any>> =>
    api.patch(`/task/${projectId}/${taskId}`, data),

  removeTask: (projectId: string, taskId: string): Promise<ApiResponse<void>> =>
    api.delete(`/task/${projectId}/${taskId}`),

  requestTaskUpdate: (
    projectId: string,
    taskId: string,
    data: RequestUpdateRequest
  ): Promise<ApiResponse<any>> =>
    api.post(`/task/request-update/${projectId}/${taskId}`, data),

  acceptPendingUpdate: (
    projectId: string,
    pendingUpdateId: string,
    data: AcceptUpdateRequest
  ): Promise<ApiResponse<void>> =>
    api.patch(`/task/accept-update/${projectId}/${pendingUpdateId}`, data),
};

// Admin endpoints
export const adminAPI = {
  viewAllUsers: (
    page: number,
    limit: number
  ): Promise<ApiResponse<AdminUser[]>> =>
    api.get(`/admin/user/${page}/${limit}`),

  removeUser: (userId: string): Promise<ApiResponse<void>> =>
    api.delete(`/admin/user/${userId}`),

  updateUserRole: (
    userId: string,
    data: UpdateUserRoleRequest
  ): Promise<ApiResponse<void>> =>
    api.patch(`/admin/users/${userId}/role`, data),
};

// Super Admin endpoints
export const superAdminAPI = {
  getStats: (): Promise<ApiResponse<SystemStats>> =>
    api.get("/super-admin/stats"),

  createAdmin: (data: {
    username: string;
    name: string;
    password: string;
  }): Promise<ApiResponse<void>> => api.post("/super-admin/create-admin", data),
};

export default api;
