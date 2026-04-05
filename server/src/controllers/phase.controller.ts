import type { Request, Response, RequestHandler } from "express";
import { z } from "zod";
import httpStatus from "http-status";

import { asyncWrapper, redis } from "../lib/index.js";
import { phaseServices, projectServices } from "../services/index.js";
import type { CreatePhaseDTO, UpdatePhaseDTO } from "../types/index.js";
import { PhaseResponseSchema, PhasesListResponseSchema, PhaseDeleteResponseSchema } from "../schemas/index.js";

export const createPhase: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }, {}, CreatePhaseDTO>, res: Response<z.infer<typeof PhaseResponseSchema>>) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const { name } = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, ["owner", "admin"]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can create phases",
      } as any);
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

export const updatePhase: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; phaseId: string }, {}, UpdatePhaseDTO>,
    res: Response<z.infer<typeof PhaseResponseSchema>>,
  ) => {
    const { projectId, phaseId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, ["owner", "admin"]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can update phases",
      } as any);
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

export const getPhases: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response<z.infer<typeof PhasesListResponseSchema>>) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, ["owner", "admin", "member"]);

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project members can view phases",
      } as any);
    }

    const cacheKey = `project:${projectId}:phases`;
    const cachedPhases = await redis.get(cacheKey);

    if (cachedPhases) {
      return res.json({
        message: "Phases retrieved successfully",
        data: JSON.parse(cachedPhases),
      });
    }

    // Fetch project with phases in a SINGLE query instead of two separate queries
    const projectWithPhases = await phaseServices.getProjectWithPhases(projectId);

    if (!projectWithPhases) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Project not found",
      } as any);
    }

    const result = {
      project: {
        id: projectWithPhases.id,
        title: projectWithPhases.title,
        description: projectWithPhases.description,
        owner: projectWithPhases.owner,
      },
      phases: projectWithPhases.phases,
    };

    await redis.set(`project:${projectId}:phases`, JSON.stringify(result), "EX", 60);

    res.json({
      message: "Phases retrieved successfully",
      data: result,
    });
  },
);
export const removePhase: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; phaseId: string }>,
    res: Response<z.infer<typeof PhaseDeleteResponseSchema>>,
  ) => {
    const { projectId, phaseId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, ["owner", "admin"]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can remove phases",
      } as any);
    }

    await phaseServices.removePhase(phaseId, projectId);

    // Invalidate phases cache
    await redis.del(`project:${projectId}:phases`);

    res.json({
      message: "Phase removed successfully",
    });
  },
);
