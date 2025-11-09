import { projectModel } from "../model/index.js";
import userModel from "../model/user.model.js";
import { APIError } from "../utils/error.js";

export const createProject = (
  title: string,
  description: string,
  userId: string,
) => {
  return projectModel.createProject(title, description, userId);
};

export const updateProject = (
  projectId: string,
  updates: { title?: string; description?: string },
) => {
  return projectModel.updateProject(projectId, updates);
};

export const removeProject = (id: string) => {
  return projectModel.removeProject(id);
};

export const addMember = async (
  projectId: string,
  inviterId: string,
  payload: { userId?: string; email?: string; access?: string },
) => {
  const { userId, email, access } = payload;
  const normalizedAccess = access === "admin" ? "admin" : "member";

  let targetUser = null;
  if (userId) {
    targetUser = await userModel.getUser(userId);
    if (!targetUser) {
      throw new APIError("User not found", 404);
    }
  }

  let invitationEmail = email || targetUser?.email;
  if (!invitationEmail) {
    throw new APIError("Email is required to send an invitation", 400);
  }

  invitationEmail = invitationEmail.trim().toLowerCase();

  if (targetUser && targetUser.id === inviterId) {
    throw new APIError("You cannot invite yourself", 400);
  }

  if (targetUser) {
    const existingMember = await projectModel.findProjectMember(
      projectId,
      targetUser.id,
    );
    if (existingMember) {
      throw new APIError("User is already a project member", 409);
    }
  }

  const existingInvitation = await projectModel.getPendingInvitationByEmail(
    projectId,
    invitationEmail,
  );

  if (existingInvitation) {
    throw new APIError("An invitation is already pending for this user", 409);
  }

  return projectModel.createProjectInvitation(
    projectId,
    inviterId,
    invitationEmail,
    normalizedAccess,
    targetUser?.id,
  );
};

export const removeMember = (projectId: string, userId: string) => {
  return projectModel.removeMember(projectId, userId);
};

export const checkUserAccess = async (
  projectId: string,
  userId: string,
  requiredAccess: string[],
) => {
  const result = await projectModel.checkUserAccess(
    projectId,
    userId,
    requiredAccess,
  );
  return !!result;
};

export const promoteProjectMember = (
  projectId: string,
  userId: string,
  access: string,
) => {
  return projectModel.promoteMember(projectId, userId, access);
};

export const getUserProjects = async (userId: string) => {
  const memberships = await projectModel.getUserProjects(userId);

  // Categorize projects by access level
  const categorized = {
    owner: [] as any[],
    admin: [] as any[],
    member: [] as any[],
  };

  for (const membership of memberships) {
    const project = membership.project;
    switch (membership.access) {
      case "owner":
        categorized.owner.push(project);
        break;
      case "admin":
        categorized.admin.push(project);
        break;
      case "member":
        categorized.member.push(project);
        break;
    }
  }

  return categorized;
};

export const getProjectMembers = (projectId: string) => {
  return projectModel.getProjectMembers(projectId);
};

export const getProjectById = (projectId: string) => {
  return projectModel.getProjectById(projectId);
};

export const getProjectInvitations = (projectId: string) => {
  return projectModel.getProjectInvitations(projectId);
};

export const getUserInvitations = async (userId: string) => {
  const user = await userModel.getUser(userId);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  return projectModel.getUserPendingInvitations(userId, normalizedEmail);
};

export const respondToInvitation = async (
  invitationId: string,
  userId: string,
  action: "accept" | "decline",
) => {
  const invitation = await projectModel.getInvitationById(invitationId);
  if (!invitation) {
    throw new APIError("Invitation not found", 404);
  }

  if (invitation.status !== "pending") {
    throw new APIError("Invitation has already been processed", 400);
  }

  const user = await userModel.getUser(userId);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  if (invitation.inviteeId && invitation.inviteeId !== userId) {
    throw new APIError(
      "You are not authorized to respond to this invitation",
      403,
    );
  }

  if (!invitation.inviteeId && invitation.email !== normalizedEmail) {
    throw new APIError(
      "You are not authorized to respond to this invitation",
      403,
    );
  }

  await projectModel.updateInvitation(invitationId, {
    inviteeId: userId,
  });

  if (action === "decline") {
    return projectModel.updateInvitation(invitationId, {
      status: "declined",
      respondedAt: new Date(),
      inviteeId: userId,
    });
  }

  const existingMember = await projectModel.findProjectMember(
    invitation.projectId,
    userId,
  );

  if (!existingMember) {
    await projectModel.addMember(
      invitation.projectId,
      userId,
      invitation.access === "admin" ? "admin" : "member",
    );
  }

  return projectModel.updateInvitation(invitationId, {
    status: "accepted",
    respondedAt: new Date(),
    inviteeId: userId,
  });
};
