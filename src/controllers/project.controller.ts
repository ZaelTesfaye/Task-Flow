import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response } from "express";
import * as projectService from "../services/project.service.js";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  AddMemberDTO,
} from "../dtos/project.dto.js";

export const createProject = asyncWrapper(
  async (req: Request<{}, {}, CreateProjectDTO>, res: Response) => {
    const { id } = req.user!;
    const { title, description } = req.body;

    const result = await projectService.createProject(title, description, id);

    res.json({
      message: "Project created successfully",
      data: result,
    });
  },
);

export const updateProject = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, UpdateProjectDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner can update the project",
      });
    }

    const result = await projectService.updateProject(projectId, updates);

    res.json({
      message: "Project updated successfully",
      data: result,
    });
  },
);

export const removeProject = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
    ]);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner can delete the project",
      });
    }

    await projectService.removeProject(projectId);

    res.json({
      message: "Project removed successfully",
    });
  },
);

export const addMember = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, AddMemberDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { userId, access = "member" } = req.body;
    const { id: requesterId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(
      projectId,
      requesterId,
      ["owner"],
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner can add members",
      });
    }

    const result = await projectService.addMember(projectId, userId, access);

    res.json({
      message: "Member added successfully",
      data: result,
    });
  },
);

export const removeProjectMember = asyncWrapper(
  async (
    req: Request<{ projectId: string; userId: string }>,
    res: Response,
  ) => {
    const { projectId, userId } = req.params;
    const { id: requesterId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(
      projectId,
      requesterId,
      ["owner"],
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner can remove members",
      });
    }

    await projectService.removeMember(projectId, userId);

    res.json({
      message: "Member removed successfully",
    });
  },
);

export const promoteProjectMember = asyncWrapper(
  async (
    req: Request<{ projectId: string; userId: string }, {}, { access: string }>,
    res: Response,
  ) => {
    const { projectId, userId } = req.params;
    const { access } = req.body;
    const { id: promoterId } = req.user!;

    const hasAccess = await projectService.checkUserAccess(
      projectId,
      promoterId,
      ["owner"],
    );

    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner can promote members",
      });
    }

    await projectService.promoteProjectMember(projectId, userId, access);

    res.json({
      status: true,
      message: "Member updated successfully",
    });
  },
);

export const getUserProjects = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;

    const result = await projectService.getUserProjects(userId);

    res.json({
      data: result,
    });
  },
);

export const getProjectMembers = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    // Check if user is a member of the project
    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project members can view project members",
      });
    }

    const result = await projectService.getProjectMembers(projectId);

    res.json({
      data: result,
    });
  },
);
