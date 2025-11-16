import { taskModel } from "../model/index.js";
import type { RequestTaskUpdateDTO, UpdateTaskDTO } from "../dtos/index.js";

export const createTask = async (
  title: string,
  description: string,
  userId: string,
  categoryId: string,
  assignedTo: string,
  projectId: string,
) => {
  return taskModel.createTask(
    title,
    description,
    userId,
    categoryId,
    assignedTo,
    projectId,
  );
};

export const updateProjectTask = async (
  taskId: string,
  updates: UpdateTaskDTO,
  projectId: string,
) => {
  return taskModel.updateTaskInProject(taskId, updates, projectId);
};

export const removeTask = async (taskId: string, projectId: string) => {
  return taskModel.removeTaskInProject(taskId, projectId);
};

export const requestTaskUpdate = async (
  taskId: string,
  userId: string,
  projectId: string,
  updateData: RequestTaskUpdateDTO,
) => {
  return taskModel.requestTaskUpdateInProject(
    taskId,
    userId,
    projectId,
    updateData,
  );
};

export const acceptPendingUpdate = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  return taskModel.acceptPendingUpdateInProject(pendingUpdateId, projectId);
};

export const rejectPendingUpdate = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  return taskModel.rejectPendingUpdateInProject(pendingUpdateId, projectId);
};
