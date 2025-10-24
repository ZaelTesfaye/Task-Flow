import * as taskModel from "../model/task.model.js";

export const addTask = (userId: string, description: string) => {
  return taskModel.addTask(userId, description);
};

export const removeTask = (userId: string, taskId: string) => {
  return taskModel.removeTask(userId, taskId);
};

export const updateTask = (
  userId: string,
  taskId: string,
  status: string,
  description: string
) => {
  return taskModel.updateTask(userId, taskId, status, description);
};

export const getTasks = (userId: string) => {
  return taskModel.getTasks(userId);
};