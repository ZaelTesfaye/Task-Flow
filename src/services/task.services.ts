import taskModel from "../model/task.model.ts";
import userModel from "../model/user.model.ts";
import { APIError } from "../utils/error.ts";
import httpStatus from "http-status";

const addTask = async (userId: string, description: string) => {
  const user = await userModel.getUser(userId);
  if (!user) {
    throw new APIError("User doesnt exist", httpStatus.BAD_REQUEST);
  }
  return await taskModel.addTask(userId, description);
};

const removeTask = async (userId: string, taskId: string) => {
  return await taskModel.removeTask(userId, taskId);
};

const updateTask = async (
  userId: string,
  taskId: string,
  status: string,
  description: string
) => {
  const result = await taskModel.updateTask(
    userId,
    taskId,
    status,
    description
  );
  if (result.count > 0) return result;
  else return null;
};

const getTasks = async (userId: string) => {
  return await taskModel.getTasks(userId);
};

const taskServices = {
  addTask,
  removeTask,
  updateTask,
  getTasks,
};

export default taskServices;
