import type { Request, Response, RequestHandler } from "express";
import httpStatus from "http-status";

import { asyncWrapper } from "../lib/index.js";
import { projectServices } from "../services/index.js";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  AddMemberDTO,
  RespondInvitationDTO,
} from "../dtos/project.dto.js";

export const createProject: RequestHandler = asyncWrapper(
  async (req: Request<{}, {}, CreateProjectDTO>, res: Response) => {
    const { id } = req.user!;
    const { title, description } = req.body;

    const result = await projectServices.createProject(title, description, id);

    res.json({
      message: "Project created successfully",
      data: result,
    });
  },
);

export const updateProject: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, UpdateProjectDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner can update the project",
      });
    }

    const result = await projectServices.updateProject(projectId, updates);

    res.json({
      message: "Project updated successfully",
      data: result,
    });
  },
);

export const removeProject: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
    ]);

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner can delete the project",
      });
    }

    await projectServices.removeProject(projectId);

    res.json({
      message: "Project removed successfully",
    });
  },
);

export const addMember: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, AddMemberDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: requesterId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(
      projectId,
      requesterId,
      ["owner"],
    );

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner can add members",
      });
    }

    const payload: { userId?: string; email?: string; access?: string } = {};
    if (req.body.userId) payload.userId = req.body.userId;
    if (req.body.email) payload.email = req.body.email;
    if (req.body.access) payload.access = req.body.access;

    const result = await projectServices.addMember(
      projectId,
      requesterId,
      payload,
    );

    res.json({
      message: "Invitation sent successfully",
      data: result,
    });
  },
);

export const getUserProjects: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;

    const result = await projectServices.getUserProjects(userId);

    res.json({
      data: result,
    });
  },
);

export const removeProjectMember: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; userId: string }>,
    res: Response,
  ) => {
    const { projectId, userId: targetUserId } = req.params;
    const { id: requesterUserId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(
      projectId,
      requesterUserId,
      ["owner"],
    );

    let isRequesterTarget: boolean;
    if (!hasAccess) {
      isRequesterTarget = await projectServices.isTargetRequester(
        projectId,
        targetUserId,
      );

      if (!isRequesterTarget) {
        return res.status(httpStatus.FORBIDDEN).json({
          message: "Only project owner or member itself can remove members",
        });
      }
    }

    await projectServices.removeMember(projectId, targetUserId);

    res.json({
      message: "Member removed successfully",
    });
  },
);

export const promoteProjectMember: RequestHandler = asyncWrapper(
  async (
    req: Request<{ projectId: string; userId: string }, {}, { access: string }>,
    res: Response,
  ) => {
    const { projectId, userId } = req.params;
    const { access } = req.body;
    const { id: promoterId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(
      projectId,
      promoterId,
      ["owner"],
    );

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner can promote members",
      });
    }

    await projectServices.promoteProjectMember(projectId, userId, access);

    res.json({
      message: "Member updated successfully",
    });
  },
);

export const getProjectMembers: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    // Check if user is a member of the project
    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project members can view project members",
      });
    }

    const result = await projectServices.getProjectMembers(projectId);

    res.json({
      data: result,
    });
  },
);

export const getProjectInvitations: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: requesterId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(
      projectId,
      requesterId,
      ["owner", "admin"],
    );

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can view invitations",
      });
    }

    const invitations = await projectServices.getProjectInvitations(projectId);

    res.json({
      data: invitations,
    });
  },
);

export const getUserInvitations: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;

    const invitations = await projectServices.getUserInvitations(userId);

    res.json({
      data: invitations,
    });
  },
);

export const respondToInvitation: RequestHandler = asyncWrapper(
  async (
    req: Request<{ invitationId: string }, {}, RespondInvitationDTO>,
    res: Response,
  ) => {
    const { invitationId } = req.params;
    const { action } = req.body;
    const { id: userId } = req.user!;

    const result = await projectServices.respondToInvitation(
      invitationId,
      userId,
      action,
    );

    res.json({
      message:
        action === "accept"
          ? "Invitation accepted successfully"
          : "Invitation declined successfully",
      data: result,
    });
  },
);

export const leaveProject: RequestHandler = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    await projectServices.leaveProject(projectId, userId);

    res.json({
      message: "You have left the project successfully",
    });
  },
);
