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
  return prisma.task.deleteMany({
    where: {
      userId: userId,
      id: taskId,
    },
  });
};

const updateTask = async (userId: string, taskId: string, status: string, description: string) => {
  return prisma.task.updateMany({
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
  updateTask,
  getTasks,
};

export default taskModel;
