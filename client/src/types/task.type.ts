import { User, Project } from "./";

export type TaskStatus = "active" | "complete" | "canceled";

export interface Phase {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhaseRequest {
  name: string;
}

export interface UpdatePhaseRequest {
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "active" | "complete" | "canceled";
  assignedTo: string;
  phaseId: string;
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
  phaseId?: string;
}

export interface TasksResponse {
  project: Project;
  phases: PhaseWithTasks[];
}

export interface PhaseWithTasks extends Phase {
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
