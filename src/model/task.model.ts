import prisma from "../lib/prisma.js";

const addTask = async (userId: string, description: string) => {
  return prisma.task.create({
    data: {
      description,
      userId: userId,
    },
  });
};

const removeTask = async (userId: string, taskId: string) => {
  return prisma.task.delete({
    where: {
      userId: userId,
      id: taskId,
    },
  });
};

const updateTaskStatus = async (userId: string, taskId: string, status: string) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
};

const getTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      userId: userId,
    },
  });
};

const taskModel = {
  addTask,
  removeTask,
  updateTaskStatus,
  getTasks,
};

export default taskModel;
