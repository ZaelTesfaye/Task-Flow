import type { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncWrapper, redis } from "../lib/index.js";
import { phaseServices, projectServices } from "../services/index.js";
import type { CreatePhaseDTO, UpdatePhaseDTO } from "../dtos/index.js";

export const createPhase = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, CreatePhaseDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const { name } = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can create phases",
      });
    }

    const result = await phaseServices.createPhase(name, projectId);

    // Invalidate phases cache
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Phase created successfully",
      data: result,
    });
  },
);

export const updatePhase = asyncWrapper(
  async (
    req: Request<
      { projectId: string; phaseId: string },
      {},
      UpdatePhaseDTO
    >,
    res: Response,
  ) => {
    const { projectId, phaseId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can update phases",
      });
    }

    const result = await phaseServices.updatePhase(phaseId, updates);

    // Invalidate phases cache
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Phase updated successfully",
      data: result,
    });
  },
);

export const getPhases = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project members can view phases",
      });
    }

    const cacheKey = `project:${projectId}:phases`;
    const cachedPhases = await redis.get(cacheKey);

    if (cachedPhases) {
      return res.json({
        message: "Phases retrieved successfully",
        data: JSON.parse(cachedPhases),
      });
    }

    const phases = await phaseServices.getPhases(projectId);
    const project = await projectServices.getProjectById(projectId);

    const result = {
      project,
      phases,
    };

    await redis.set(
      `project:${projectId}:phases`,
      JSON.stringify(result),
      "EX",
      60,
    );

    res.json({
      message: "Phases retrieved successfully",
      data: result,
    });
  },
);
export const removePhase = asyncWrapper(
  async (
    req: Request<{ projectId: string; phaseId: string }>,
    res: Response,
  ) => {
    const { projectId, phaseId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can remove phases",
      });
    }

    await phaseServices.removePhase(phaseId, projectId);

    // Invalidate phases cache
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Phase removed successfully",
    });
  },
);
