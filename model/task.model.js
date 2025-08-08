const prisma = require("../lib/prisma");

const addTask = async (userId, description) => {
      return await prisma.task.create({
    data: {
      description,
      userId: userId
    },
  });
}

const removeTask = async (userId, taskId) => {
  return await prisma.task.delete({
    where: {
      userId: userId,
      id: taskId,
    },
  });
};

const updateTaskStatus = async (userId, taskId, status) => {
  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
};

const getTasks = async (userId) => {
  console.log("Used Id: ", userId)
    return await prisma.task.findMany({
    where: {
      userId: userId,
    },
  });
};

module.exports = {
  addTask,
  removeTask,
  updateTaskStatus,
  getTasks,
}