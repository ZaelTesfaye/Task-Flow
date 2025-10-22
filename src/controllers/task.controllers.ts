import taskServices from "../services/task.services.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response, NextFunction } from "express";
import type {
  AddTaskBody,
  RemoveTaskBody,
  UpdateTaskSchema,
  GetTasksParams,
} from "../dtos/task.dto.js";
import { APIError } from "../utils/error.js";
import httpStatus from "http-status";

const addTask = asyncWrapper(
  async (
    req: Request<{}, {}, AddTaskBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {id: userId} = req.user!;
    const { description } = req.body;
    await taskServices.addTask(userId, description);

    res.status(201).json({
      status: true,
      message: "Task Added successfully",
    });
  }
);

const removeTask = asyncWrapper(
  async (
    req: Request<{}, {}, RemoveTaskBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { id: userId } = req.user!;
    const { taskId } = req.body;
    const result = await taskServices.removeTask(userId, taskId);

    if (result.count > 0) {
      res.status(200).json({
        status: true,
        message: "Task Removed successfully",
      });
    } else {
      throw new APIError("Task not found", httpStatus.BAD_REQUEST);
    }
  }
);

const updateTask = asyncWrapper(
  async (
    req: Request<{}, {}, UpdateTaskSchema>,
    res: Response,
    next: NextFunction
  ) => {
    const { id: userId } = req.user!;
    const { taskId, status, description } = req.body;

    const result = await taskServices.updateTask(
      userId,
      taskId,
      status,
      description
    );
    if (result) {
      res.status(200).json({
        status: true,
        message: "Task updated successfully",
      });
    } else {
      throw new APIError("Task Not Found", httpStatus.BAD_REQUEST);
    }
  }
);

const getTasks = asyncWrapper(
  async (req: Request<GetTasksParams>, res: Response, next: NextFunction) => {
    const { id: userId } = req.user!;
    const tasks = await taskServices.getTasks(userId);
    res.status(200).json({
      status: true,
      tasks,
    });
  }
);

const userControllers = {
  addTask,
  removeTask,
  updateTask,
  getTasks,
};

export default userControllers;
