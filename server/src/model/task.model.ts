import type { RequestTaskUpdateDTO, UpdateTaskDTO } from "../dtos/index.js";
import prisma from "../lib/prisma.js";

export const createTask = async (
  title: string,
  description: string,
  assignedBy: string,
  categoryId: string,
  assignedTo: string,
  projectId: string,
) => {
  // Validate that the assignedTo user is a member of the project
  const isMember = await prisma.projectMembers.findFirst({
    where: {
      projectId,
      userId: assignedTo,
    },
  });

  if (!isMember) {
    throw new Error("Assigned user must be a member of the project");
  }

  return prisma.task.create({
    data: {
      title,
      categoryId,
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

export const updateTaskInProject = async (
  taskId: string,
  updates: UpdateTaskDTO,
  projectId: string,
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId },
    include: { Category: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.Category?.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }

  return updateTask(taskId, updates);
};

export const removeTask = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const removeTaskInProject = async (
  taskId: string,
  projectId: string,
) => {
  // Validate the task belongs to the project
  const task = await prisma.task.findFirst({
    where: { id: taskId },
    include: { Category: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.Category?.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }

  return removeTask(taskId);
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

export const requestTaskUpdateInProject = async (
  taskId: string,
  userId: string,
  projectId: string,
  updateData: RequestTaskUpdateDTO,
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId },
    include: { Category: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.Category?.projectId !== projectId) {
    throw new Error("Task does not belong to the specified project");
  }

  // Check if the requesting user is the one assigned to the task
  if (task.assignedTo !== userId) {
    throw new Error("Only the user assigned to the task can request updates");
  }

  return createPendingUpdate(taskId, userId, updateData);
};

export const acceptPendingUpdate = async (
  pendingUpdateId: string,
  taskId: string,
  newStatus: string,
) => {
  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
    },
  });

  return prisma.pendingUpdates.delete({
    where: { id: pendingUpdateId },
  });
};

export const acceptPendingUpdateInProject = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  const pendingUpdate = await prisma.pendingUpdates.findUnique({
    where: { id: pendingUpdateId },
    include: {
      task: {
        include: { Category: true },
      },
    },
  });

  //check pending update exists
  if (!pendingUpdate) {
    throw new Error("Pending update not found");
  }

  // verify that the task in pending updates belongs to the specified project (the project which we already veriied that the user has access to)
  if (pendingUpdate.task.Category?.projectId !== projectId) {
    throw new Error("Pending update does not belong to the specified project");
  }

  return acceptPendingUpdate(
    pendingUpdate.id,
    pendingUpdate.taskId,
    pendingUpdate.newStatus,
  );
};

export const rejectPendingUpdate = async (pendingUpdateId: string) => {
  return prisma.pendingUpdates.delete({
    where: { id: pendingUpdateId },
  });
};

export const rejectPendingUpdateInProject = async (
  pendingUpdateId: string,
  projectId: string,
) => {
  const pendingUpdate = await prisma.pendingUpdates.findUnique({
    where: { id: pendingUpdateId },
    include: {
      task: {
        include: { Category: true },
      },
    },
  });

  //check pending update exists
  if (!pendingUpdate) {
    throw new Error("Pending update not found");
  }

  // verify that the task in pending updates belongs to the specified project (the project which we already veriied that the user has access to)
  if (pendingUpdate.task.Category?.projectId !== projectId) {
    throw new Error("Pending update does not belong to the specified project");
  }

  return rejectPendingUpdate(pendingUpdateId);
};
