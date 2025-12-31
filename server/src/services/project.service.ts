import { memberModel, projectModel } from "../model/index.js";
import { userModel } from "../model/index.js";
import { APIError } from "../utils/index.js";
import config from "../config/config.js";
import * as emailServices from "./email.service.js";

export const createProject = async (
  title: string,
  description: string,
  userId: string,
) => {
  const user = await userModel.getUser(userId);
  if (!user) {
    throw new APIError("User not found", 404);
  }

  const projectCount = await projectModel.countProjectsByOwnerId(userId);
  let limit = 5;

  const isSubscribed =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date();

  if (isSubscribed) {
    if (user.stripePriceId === config.stripe.starter.priceId) {
      limit = 10;
    } else if (user.stripePriceId === config.stripe.pro.priceId) {
      limit = 1000; // Unlimited effectively
    }
  }

  if (projectCount >= limit) {
    throw new APIError(
      `You have reached the project limit of ${limit} for your current plan. Please upgrade to create more projects.`,
      403,
    );
  }

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

  // If email provided but no userId, check if user exists with that email
  if (!targetUser && invitationEmail) {
    targetUser = await userModel.findByEmail(invitationEmail);
  }

  if (targetUser && targetUser.id === inviterId) {
    throw new APIError("You cannot invite yourself", 400);
  }

  if (targetUser) {
    const existingMember = await memberModel.findMember(
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

  // Check member limit based on project owner's subscription
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    throw new APIError("Project not found", 404);
  }

  const projectOwner = await userModel.getUser(project.ownerId);
  if (!projectOwner) {
    throw new APIError("Project owner not found", 404);
  }

  const currentMemberCount = await memberModel.countProjectMembers(projectId);
  let memberLimit = 3; // Free plan default

  const isSubscribed =
    projectOwner.stripePriceId &&
    projectOwner.stripeCurrentPeriodEnd &&
    projectOwner.stripeCurrentPeriodEnd > new Date();

  if (isSubscribed) {
    if (projectOwner.stripePriceId === config.stripe.starter.priceId) {
      memberLimit = 10;
    } else if (projectOwner.stripePriceId === config.stripe.pro.priceId) {
      memberLimit = 1000; // Unlimited effectively
    }
  }

  if (currentMemberCount >= memberLimit) {
    throw new APIError(
      `You have reached the member limit of ${memberLimit} for your current plan. Please upgrade to add more members.`,
      403,
    );
  }

  // Get inviter information for email
  const inviter = await userModel.getUser(inviterId);
  if (!inviter) {
    throw new APIError("Inviter not found", 404);
  }

  // Create the invitation
  const invitation = await projectModel.createProjectInvitation(
    projectId,
    inviterId,
    invitationEmail,
    normalizedAccess,
    targetUser?.id,
  );

  // Send invitation email
  try {
    if (targetUser) {
      // User is registered - send email with link to invitations page
      await emailServices.sendInvitationToRegisteredUser(
        inviter.name,
        targetUser.name,
        invitationEmail,
        project.title,
      );
    } else {
      // User is not registered - send email with link to signup
      await emailServices.sendInvitationToNonRegisteredUser(
        inviter.name,
        invitationEmail,
        project.title,
      );
    }
  } catch (emailError) {
    // Log the error but don't fail the invitation creation
    console.error("Failed to send invitation email:", emailError);
    // Invitation is still created successfully
  }

  return invitation;
};

export const removeMember = (projectId: string, userId: string) => {
  return memberModel.removeMember(projectId, userId);
};

export const checkUserAccess = async (
  projectId: string,
  userId: string,
  requiredAccess: string[],
) => {
  const result = await memberModel.getProjectMemberWithAccess(
    projectId,
    userId,
    requiredAccess,
  );
  return !!result;
};

export const isTargetRequester = async (projectId: string, userId: string) => {
  const result = await memberModel.findMember(projectId, userId);

  if (!result) return false;

  if (result.userId !== userId) return false;

  return true;
};

export const promoteProjectMember = (
  projectId: string,
  userId: string,
  access: string,
) => {
  return memberModel.updateMemberAccess(projectId, userId, access);
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
  return memberModel.getProjectMembers(projectId);
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

  const existingMember = await memberModel.findMember(
    invitation.projectId,
    userId,
  );

  if (!existingMember) {
    await memberModel.addMember(
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
