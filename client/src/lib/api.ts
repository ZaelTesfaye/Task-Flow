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
  Project,
  ProjectMember,
  AddMemberRequest,
  UpdateMemberRequest,
  CreatePhaseRequest,
  UpdatePhaseRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  RequestUpdateRequest,
  AcceptUpdateRequest,
  ProjectInvitation,
  RespondInvitationRequest,
} from "@/types/index";

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
    api
      .post<ApiResponse<AuthResponse>>("/custom-auth/register", data)
      .then((r) => r.data),

  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    api
      .post<ApiResponse<AuthResponse>>("/custom-auth/login", data)
      .then((r) => r.data),

  logout: (): Promise<ApiResponse<void>> =>
    api.post<ApiResponse<void>>("/custom-auth/logout").then((r) => r.data),

  requestPasswordReset: (
    email: string
  ): Promise<ApiResponse<{ message: string }>> =>
    api
      .post<
        ApiResponse<{ message: string }>
      >("/custom-auth/forgot-password", { email })
      .then((r) => r.data),

  verifyResetCode: (
    email: string,
    code: string
  ): Promise<ApiResponse<{ message: string }>> =>
    api
      .post<
        ApiResponse<{ message: string }>
      >("/custom-auth/verify-reset-code", { email, code })
      .then((r) => r.data),

  resetPassword: (
    email: string,
    newPassword: string
  ): Promise<ApiResponse<AuthResponse>> =>
    api
      .post<
        ApiResponse<AuthResponse>
      >("/custom-auth/reset-password", { email, newPassword })
      .then((r) => r.data),
};

// User endpoints
export const userAPI = {
  getMe: (): Promise<any> => api.get<any>("/user/me").then((r) => r.data),

  updateUser: (data: UpdateUserRequest): Promise<ApiResponse<any>> =>
    api.patch<ApiResponse<any>>("/user", data).then((r) => r.data),

  deleteUser: (): Promise<ApiResponse<void>> =>
    api.delete<ApiResponse<void>>("/user").then((r) => r.data),
};

// Project endpoints
export const projectAPI = {
  createProject: (data: CreateProjectRequest): Promise<Project> =>
    api
      .post<{ message: string; data: Project }>("/project", data)
      .then((r) => r.data.data),

  updateProject: (
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<any>> =>
    api
      .patch<ApiResponse<any>>(`/project/${projectId}`, data)
      .then((r) => r.data),

  getUserProjects: (): Promise<ApiResponse<UserProjectsResponse>> =>
    api.get<ApiResponse<UserProjectsResponse>>("/project").then((r) => r.data),

  removeProject: (projectId: string): Promise<ApiResponse<void>> =>
    api.delete<ApiResponse<void>>(`/project/${projectId}`).then((r) => r.data),

  addMember: (
    projectId: string,
    data: AddMemberRequest
  ): Promise<ApiResponse<ProjectInvitation>> =>
    api
      .post<
        ApiResponse<ProjectInvitation>
      >(`/project/member/${projectId}`, data)
      .then((r) => r.data),

  updateMember: (
    projectId: string,
    userId: string,
    data: UpdateMemberRequest
  ): Promise<ApiResponse<void>> =>
    api
      .patch<ApiResponse<void>>(`/project/member/${projectId}/${userId}`, data)
      .then((r) => r.data),

  getProjectMembers: (
    projectId: string
  ): Promise<ApiResponse<ProjectMember[]>> =>
    api
      .get<ApiResponse<ProjectMember[]>>(`/project/member/${projectId}`)
      .then((r) => r.data),

  removeProjectMember: (
    projectId: string,
    userId: string
  ): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/project/member/${projectId}/${userId}`)
      .then((r) => r.data),

  leaveProject: (
    projectId: string,
    userId: string
  ): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/project/member/${projectId}/${userId}`)
      .then((r) => r.data),

  getProjectInvitations: (
    projectId: string
  ): Promise<ApiResponse<ProjectInvitation[]>> =>
    api
      .get<
        ApiResponse<ProjectInvitation[]>
      >(`/project/member/${projectId}/invitations`)
      .then((r) => r.data),

  getMyInvitations: (): Promise<ApiResponse<ProjectInvitation[]>> =>
    api
      .get<ApiResponse<ProjectInvitation[]>>(`/project/invitations`)
      .then((r) => r.data),

  respondToInvitation: (
    invitationId: string,
    data: RespondInvitationRequest
  ): Promise<ApiResponse<ProjectInvitation>> =>
    api
      .patch<
        ApiResponse<ProjectInvitation>
      >(`/project/invitations/${invitationId}`, data)
      .then((r) => r.data),
};

// Phase endpoints
export const phaseAPI = {
  createPhase: (
    projectId: string,
    data: CreatePhaseRequest
  ): Promise<ApiResponse<any>> =>
    api.post<ApiResponse<any>>(`/phase/${projectId}`, data).then((r) => r.data),

  updatePhase: (
    projectId: string,
    phaseId: string,
    data: UpdatePhaseRequest
  ): Promise<ApiResponse<any>> =>
    api
      .patch<ApiResponse<any>>(`/phase/${projectId}/${phaseId}`, data)
      .then((r) => r.data),

  removePhase: (
    projectId: string,
    phaseId: string
  ): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/phase/${projectId}/${phaseId}`)
      .then((r) => r.data),
};

// Task endpoints
export const taskAPI = {
  createTask: (
    projectId: string,
    phaseId: string,
    data: CreateTaskRequest
  ): Promise<ApiResponse<any>> =>
    api
      .post<ApiResponse<any>>(`/task/${projectId}/${phaseId}`, data)
      .then((r) => r.data),

  getPhases: (projectId: string): Promise<ApiResponse<TasksResponse>> =>
    api
      .get<ApiResponse<TasksResponse>>(`/phase/${projectId}`)
      .then((r) => r.data),

  updateTask: (
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<ApiResponse<any>> =>
    api
      .patch<ApiResponse<any>>(`/task/${projectId}/${taskId}`, data)
      .then((r) => r.data),

  removeTask: (projectId: string, taskId: string): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/task/${projectId}/${taskId}`)
      .then((r) => r.data),

  requestTaskUpdate: (
    projectId: string,
    taskId: string,
    data: RequestUpdateRequest
  ): Promise<ApiResponse<any>> =>
    api
      .post<
        ApiResponse<any>
      >(`/task/request-update/${projectId}/${taskId}`, data)
      .then((r) => r.data),

  acceptPendingUpdate: (
    projectId: string,
    pendingUpdateId: string,
    data: AcceptUpdateRequest
  ): Promise<ApiResponse<void>> =>
    api
      .patch<
        ApiResponse<void>
      >(`/task/accept-update/${projectId}/${pendingUpdateId}`, data)
      .then((r) => r.data),

  rejectPendingUpdate: (
    projectId: string,
    pendingUpdateId: string
  ): Promise<ApiResponse<void>> =>
    api
      .patch<
        ApiResponse<void>
      >(`/task/reject-update/${projectId}/${pendingUpdateId}`)
      .then((r) => r.data),
};

export const stripeAPI = {
  createCheckoutSession: (plan: string): Promise<{ url: string }> =>
    api
      .post<{ url: string }>("/stripe/subscribe", { plan })
      .then((r) => r.data),

  verifySubscriptionStatus: (
    sessionId: string
  ): Promise<{
    isPremium: boolean;
    status: string;
    message: string;
    priceId?: string;
    subscriptionId?: string;
  }> =>
    api
      .get("/stripe/verify-subscription", {
        params: { sessionId },
      })
      .then((r) => r.data),

  createPortalSession: (): Promise<{ url: string }> =>
    api
      .post<{ url: string }>("/stripe/create-portal-session")
      .then((r) => r.data),
};

export const notificationAPI = {
  getUnreadNotifications: (): Promise<
    ApiResponse<
      {
        id: string;
        type: string;
        message: string;
        isRead: boolean;
        createdAt: string;
        userId: string;
        taskId: string | null;
        projectId: string | null;
      }[]
    >
  > =>
    api
      .get<
        ApiResponse<
          {
            id: string;
            type: string;
            message: string;
            isRead: boolean;
            createdAt: string;
            userId: string;
            taskId: string | null;
            projectId: string | null;
          }[]
        >
      >("/notification/unread")
      .then((r) => r.data),

  getProjectNotificationCount: (
    projectId: string
  ): Promise<ApiResponse<{ count: number }>> =>
    api
      .get<
        ApiResponse<{ count: number }>
      >(`/notification/project/${projectId}/count`)
      .then((r) => r.data),

  markNotificationAsRead: (
    notificationId: string
  ): Promise<ApiResponse<void>> =>
    api
      .patch<ApiResponse<void>>(`/notification/${notificationId}/read`)
      .then((r) => r.data),

  markProjectNotificationsAsRead: (
    projectId: string
  ): Promise<ApiResponse<void>> =>
    api
      .patch<ApiResponse<void>>(`/notification/project/${projectId}/read`)
      .then((r) => r.data),

  deleteNotification: (notificationId: string): Promise<ApiResponse<void>> =>
    api
      .delete<ApiResponse<void>>(`/notification/${notificationId}`)
      .then((r) => r.data),
};
