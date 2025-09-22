import taskModel from '../model/task.model.js';


const addTask = async (userId: string, description: string) => {
  return await taskModel.addTask(userId, description);
};

const removeTask = async (userId: string, taskId: string) => {
  return await taskModel.removeTask(userId, taskId);
};

const updateTaskStatus = async (userId: string, taskId: string, status: string) => {
  return await taskModel.updateTaskStatus(userId, taskId, status);
};

const getTasks = async (userId: string) => {
  return await taskModel.getTasks(userId);
};

const taskServices = {
  addTask,
  removeTask,
  updateTaskStatus,
  getTasks,
}

export default taskServices;