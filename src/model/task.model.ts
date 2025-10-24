import prisma from "../lib/prisma.js";

export const addTask = async (userId: string, description: string) => {
  return prisma.task.create({
    data: {
      description,
      userId: userId,
    },
  });
};

export const removeTask = async (userId: string, taskId: string) => {
  return prisma.task.delete({
    where: {
      userId: userId,
      id: taskId,
    },
  });
};

export const updateTask = async (userId: string, taskId: string, status: string, description: string) => {
  return prisma.task.update({
    where: {
      userId,
      id: taskId,
    },
    data: {
      status,
      description
    },
  });
};

export const getTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      userId: userId,
    },
  });
};

export const taskModel = {
  addTask,
  removeTask,
  updateTask,
  getTasks,
};

export default taskModel;
