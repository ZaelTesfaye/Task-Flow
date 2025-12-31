import type { Request, Response, RequestHandler } from "express";
import httpStatus from "http-status";

import { asyncWrapper, redis } from "../lib/index.js";
import {
  taskServices,
  phaseServices,
  projectServices,
} from "../services/index.js";
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  RequestTaskUpdateDTO as TaskUpdateRequestDTO,
  AcceptPendingUpdateDTO,
} from "../dtos/index.js";

export const createTask: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; phaseId: string }, {}, CreateTaskDTO>,
    res: Response,
  ) => {
    const { projectId, phaseId } = req.params;
    const { id: userId } = req.user!;
    const { title, description, assignedTo } = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can create tasks",
      });
    }

    const phase = await phaseServices.getPhase(phaseId, projectId);
    if (!phase) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Phase does not belong to the specified project",
      });
    }

    const result = await taskServices.createTask(
      title,
      description,
      userId,
      phaseId,
      assignedTo,
      projectId,
    );

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Task created successfully",
      data: result,
    });
  },
);

export const updateTask: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; taskId: string }, {}, UpdateTaskDTO>,
    res: Response,
  ) => {
    const { projectId, taskId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can update tasks",
      });
    }

    const result = await taskServices.updateProjectTask(
      taskId,
      updates,
      projectId,
    );

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Task updated successfully",
      data: result,
    });
  },
);

export const removeTask: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; taskId: string }>,
    res: Response,
  ) => {
    const { projectId, taskId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can remove tasks",
      });
    }

    await taskServices.removeTask(taskId, projectId);

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Task removed successfully",
    });
  },
);

export const requestTaskUpdate: RequestHandler = asyncWrapper(
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

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "member",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project members can request task updates",
      });
    }

    const result = await taskServices.requestTaskUpdate(
      taskId,
      userId,
      projectId,
      updateData,
    );

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Task update requested successfully",
      data: result,
    });
  },
);

export const acceptPendingUpdate: RequestHandler = asyncWrapper(
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

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can accept pending updates",
      });
    }

    const result = await taskServices.acceptPendingUpdate(
      pendingUpdateId,
      projectId,
    );

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Pending update accepted successfully",
      data: result,
    });
  },
);

export const rejectPendingUpdate: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; pendingUpdateId: string }>,
    res: Response,
  ) => {
    const { projectId, pendingUpdateId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can reject pending updates",
      });
    }

    const result = await taskServices.rejectPendingUpdate(
      pendingUpdateId,
      projectId,
    );

    // Invalidate phases cache (which includes tasks)
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Pending update rejected successfully",
      data: result,
    });
  },
);
