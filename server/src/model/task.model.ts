import type { RequestTaskUpdateDTO, UpdateTaskDTO } from "../dtos/index.js";
import prisma from "../lib/prisma.js";

export const createTask = async (
  title: string,
  description: string,
  assignedBy: string,
  phaseId: string,
  assignedTo: string,
) => {
  return prisma.task.create({
    data: {
      title,
      phaseId,
      description,
      assignedBy,
      assignedTo,
    },
  });
};

export const updateTask = async (taskId: string, updates: UpdateTaskDTO) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: updates,
  });
};

export const findTaskById = async (taskId: string) => {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: { Phase: true },
  });
};

export const findPendingUpdateById = async (pendingUpdateId: string) => {
  return prisma.pendingUpdates.findUnique({
    where: { id: pendingUpdateId },
    include: {
      task: {
        include: { Phase: true },
      },
    },
  });
};

export const removeTask = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const createPendingUpdate = async (
  taskId: string,
  userId: string,
  updateData: RequestTaskUpdateDTO,
) => {
  return prisma.pendingUpdates.create({
    data: {
      taskId,
      updateDescription: updateData.updateDescription,
      newStatus: updateData.newStatus,
      updateBy: userId,
    },
  });
};

export const removePendingUpdate = async (pendingUpdateId: string) => {
  return prisma.pendingUpdates.delete({
    where: { id: pendingUpdateId },
  });
};
