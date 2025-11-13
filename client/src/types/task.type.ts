import { User, Project } from "./";

export type TaskStatus = "active" | "complete" | "canceled";

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
