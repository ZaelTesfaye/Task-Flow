import * as taskServices from "../services/task.services.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response, NextFunction } from "express";
import type {
  AddTaskBody,
  RemoveTaskBody,
  UpdateTaskSchema,
  GetTasksParams,
} from "../dtos/task.dto.js";

export const addTask = asyncWrapper(
  async (
    req: Request<{}, {}, AddTaskBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id: userId } = req.user!;
    const { description } = req.body;
    await taskServices.addTask(userId, description);

    res.status(201).json({
      status: true,
      message: "Task Added successfully",
    });
  },
);

export const removeTask = asyncWrapper(
  async (
    req: Request<{}, {}, RemoveTaskBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id: userId } = req.user!;
    const { taskId } = req.body;
    await taskServices.removeTask(userId, taskId);

    res.status(200).json({
      status: true,
      message: "Task Removed successfully",
    });
  },
);

export const updateTask = asyncWrapper(
  async (
    req: Request<{}, {}, UpdateTaskSchema>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id: userId } = req.user!;
    const { taskId, status, description } = req.body;

    await taskServices.updateTask(userId, taskId, status, description);
    res.status(200).json({
      status: true,
      message: "Task updated successfully",
    });
  },
);

export const getTasks = asyncWrapper(
  async (req: Request<GetTasksParams>, res: Response, next: NextFunction) => {
    const { id: userId } = req.user!;
    const tasks = await taskServices.getTasks(userId);
    res.status(200).json({
      status: true,
      tasks,
    });
  },
);
