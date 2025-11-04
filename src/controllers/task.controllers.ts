import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response } from "express";
import * as taskServices from "../services/task.services.js";
import * as categoryService from "../services/category.service.js";
import * as projectService from "../services/project.service.js";
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  RequestTaskUpdateDTO as TaskUpdateRequestDTO,
  AcceptPendingUpdateDTO,
} from "../dtos/task.dto.js";

export const createTask = asyncWrapper(
  async (
    req: Request<{ projectId: string; categoryId: string }, {}, CreateTaskDTO>,
    res: Response,
  ) => {
    const { projectId, categoryId } = req.params;
    const { id: userId } = req.user!;
    const { title, description, assignedTo } = req.body;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can create tasks",
      });
    }

    const category = await categoryService.validateCategoryBelongsToProject(
      categoryId,
      projectId,
    );
    if (!category) {
      return res.status(403).json({
        message: "Category does not belong to the specified project",
      });
    }

    const result = await taskServices.createTask(
      title,
      description,
      userId,
      categoryId,
      assignedTo,
    );

    res.json({
      message: "Task created successfully",
      data: result,
    });
  },
);

export const getTasks = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
      "member",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project members can view tasks",
      });
    }

    const result = await taskServices.getTasks(projectId);

    res.json({
      data: result,
    });
  },
);

export const updateTask = asyncWrapper(
  async (
    req: Request<{ projectId: string; taskId: string }, {}, UpdateTaskDTO>,
    res: Response,
  ) => {
    const { projectId, taskId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can update tasks",
      });
    }

    const result = await taskServices.updateProjectTask(
      taskId,
      updates,
      projectId,
    );

    res.json({
      message: "Task updated successfully",
      data: result,
    });
  },
);

export const removeTask = asyncWrapper(
  async (
    req: Request<{ projectId: string; taskId: string }>,
    res: Response,
  ) => {
    const { projectId, taskId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can remove tasks",
      });
    }

    await taskServices.removeTask(taskId, projectId);

    res.json({
      message: "Task removed successfully",
    });
  },
);

export const requestTaskUpdate = asyncWrapper(
  async (
    req: Request<
      { projectId: string; taskId: string },
      {},
      TaskUpdateRequestDTO
    >,
    res: Response,
  ) => {
    const { projectId, taskId } = req.params;
    const { id: userId } = req.user!;
    const updateData = req.body;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "member",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project members can request task updates",
      });
    }

    const result = await taskServices.requestTaskUpdate(
      taskId,
      userId,
      projectId,
      updateData,
    );

    res.json({
      message: "Task update requested successfully",
      data: result,
    });
  },
);

export const acceptPendingUpdate = asyncWrapper(
  async (
    req: Request<
      { projectId: string; pendingUpdateId: string },
      {},
      AcceptPendingUpdateDTO
    >,
    res: Response,
  ) => {
    const { projectId, pendingUpdateId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can accept pending updates",
      });
    }

    const result = await taskServices.acceptPendingUpdate(
      pendingUpdateId,
      projectId,
    );

    res.json({
      message: "Pending update accepted successfully",
      data: result,
    });
  },
);
