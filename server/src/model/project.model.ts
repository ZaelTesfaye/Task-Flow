import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const createProject = (
  title: string,
  description: string,
  userId: string,
) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const project = await tx.project.create({
      data: {
        title: title,
        description: description,
        ownerId: userId,
      },
    });

    await tx.projectMembers.create({
      data: {
        userId: userId,
        projectId: project.id,
        access: "owner",
      },
    });

    return project;
  });
};

export const updateProject = (
  projectId: string,
  updates: { title?: string; description?: string },
) => {
  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: updates,
  });
};

export const removeProject = (id: string) => {
  return prisma.project.delete({
    where: {
      id: id,
    },
  });
};

export const getProjectById = (projectId: string) => {
  return prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getUserProjects = (userId: string) => {
  return prisma.projectMembers.findMany({
    where: {
      userId,
    },
    include: {
      project: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getPendingInvitationByEmail = (
  projectId: string,
  email: string,
) => {
  return prisma.projectInvitation.findFirst({
    where: {
      projectId,
      email,
      status: "pending",
    },
  });
};

export const createProjectInvitation = (
  projectId: string,
  inviterId: string,
  email: string,
  access: string,
  inviteeId?: string,
) => {
  return prisma.projectInvitation.create({
    data: {
      projectId,
      inviterId,
      email,
      access,
      inviteeId: inviteeId || null,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getProjectInvitations = (projectId: string) => {
  return prisma.projectInvitation.findMany({
    where: {
      projectId,
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getInvitationById = (invitationId: string) => {
  return prisma.projectInvitation.findUnique({
    where: {
      id: invitationId,
    },
    include: {
      project: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateInvitation = (
  invitationId: string,
  data: {
    status?: string;
    respondedAt?: Date | null;
    inviteeId?: string | null;
  },
) => {
  return prisma.projectInvitation.update({
    where: {
      id: invitationId,
    },
    data,
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      invitee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getUserPendingInvitations = (userId: string, email: string) => {
  return prisma.projectInvitation.findMany({
    where: {
      status: "pending",
      OR: [
        {
          inviteeId: userId,
        },
        {
          AND: [{ inviteeId: null }, { email }],
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      inviter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const countProjectsByOwnerId = (ownerId: string) => {
  return prisma.project.count({
    where: {
      ownerId,
    },
  });
};
