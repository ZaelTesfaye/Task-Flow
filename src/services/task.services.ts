import taskModel from "../model/task.model.js";

const addTask = (userId: string, description: string) => {
  return taskModel.addTask(userId, description);
};

const removeTask = (userId: string, taskId: string) => {
  return taskModel.removeTask(userId, taskId);
};

const updateTask = (
  userId: string,
  taskId: string,
  status: string,
  description: string
) => {
  return taskModel.updateTask(userId, taskId, status, description);
};

const getTasks = (userId: string) => {
  return taskModel.getTasks(userId);
};

const taskServices = {
  addTask,
  removeTask,
  updateTask,
  getTasks,
};

export default taskServices;
