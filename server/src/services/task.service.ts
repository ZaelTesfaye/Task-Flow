import {
  memberModel,
  taskModel,
  userModel,
  projectModel,
} from "../model/index.js";
import type { RequestTaskUpdateDTO, UpdateTaskDTO } from "../dtos/index.js";
import { sendTaskAssignmentEmail } from "./email.service.js";
import { createTaskAssignedNotification } from "./notification.service.js";

export const createTask = async (
  title: string,
  description: string,
  userId: string,
  phaseId: string,
  assignedTo: string,
  projectId: string,
) => {
  const isMember = await memberModel.findMember(projectId, assignedTo);

  if (!isMember) {
    throw new Error("Assigned user must be a member of the project");
  }

  const task = await taskModel.createTask(
    title,
    description,
    userId,
    phaseId,
    assignedTo,
  );

  // Get assignee and assigner details
  const [assignee, assigner, project] = await Promise.all([
    userModel.findById(assignedTo),
    userModel.findById(userId),
    projectModel.getProjectById(projectId),
  ]);

  if (assignee && assigner && project) {
    // Send email notification (don't await to avoid blocking)
    sendTaskAssignmentEmail(
      assignee.name,
      assignee.email,
      title,
      description,
      project.title,
      assigner.name,
      projectId,
    ).catch((err) =>
      console.error("Failed to send task assignment email:", err),
    );

    // Create in-app notification (don't await to avoid blocking)
    createTaskAssignedNotification(
      assignedTo,
      task.id,
      projectId,
      title,
      assigner.name,
    ).catch((err) => console.error("Failed to create notification:", err));
  }

  return task;
};

export const updateProjectTask = async (
  taskId: string,
  updates: UpdateTaskDTO,
  projectId: string,
) => {
  const task = await taskModel.findTaskById(taskId);
  if (!task) throw new Error("Task not found");

  if (task.Phase?.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }

  return taskModel.updateTask(taskId, updates);
};

export const removeTask = async (taskId: string, projectId: string) => {
  const task = await taskModel.findTaskById(taskId);
  if (!task) throw new Error("Task not found");
  if (!task.Phase || task.Phase.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }
  return taskModel.removeTask(taskId);
};

export const requestTaskUpdate = async (
  taskId: string,
  userId: string,
  projectId: string,
  updateData: RequestTaskUpdateDTO,
) => {
  const task = await taskModel.findTaskById(taskId);

  if (!task) throw new Error("Task not found");

  if (!task.Phase || task.Phase?.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }

  if (task.assignedTo !== userId) {
    throw new Error("Only the user assigned to the task can request updates");
  }

  return taskModel.createPendingUpdate(taskId, userId, updateData);
};

export const acceptPendingUpdate = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  const pendingUpdate = await taskModel.findPendingUpdateById(pendingUpdateId);
  if (!pendingUpdate) {
    throw new Error("Pending update not found");
  }

  if (pendingUpdate.task.Phase?.projectId !== projectId) {
    throw new Error("Pending update does not belong to the specified project");
  }

  await taskModel.updateTask(pendingUpdate.taskId, {
    status: pendingUpdate.newStatus as "active" | "complete" | "canceled",
  });

  return taskModel.removePendingUpdate(pendingUpdateId);
};

export const rejectPendingUpdate = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  const pendingUpdate = await taskModel.findPendingUpdateById(pendingUpdateId);
  if (!pendingUpdate) {
    throw new Error("Pending update not found");
  }

  if (pendingUpdate.task.Phase?.projectId !== projectId) {
    throw new Error("Pending update does not belong to the specified project");
  }

  return taskModel.removePendingUpdate(pendingUpdateId);
};
