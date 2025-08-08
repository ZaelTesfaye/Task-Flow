const prisma = require("../lib/prisma");
const taskModel = require('../model/task.model');

const addTask = async (userId, description) => {
  return await taskModel.addTask(userId, description);
};

const removeTask = async (userId, taskId) => {
  return await taskModel.removeTask(userId, description);
};

const updateTaskStatus = async (userId, taskId, status) => {
  return await taskModel.updateTaskStatus(userId, description);
};

const getTasks = async (userId) => {
  return await taskModel.getTasks(userId, description);
};

module.exports = {
  addTask,
  removeTask,
  updateTaskStatus,
  getTasks,
}