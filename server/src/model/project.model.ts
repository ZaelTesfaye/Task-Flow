import prisma from "../lib/prisma.js";

const prismaAny = prisma as any;

export const createProject = (
  title: string,
  description: string,
  userId: string,
) => {
  return prisma.$transaction(async (tx) => {
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

export const addMember = (
  projectId: string,
  userId: string,
  access: string = "member",
) => {
  return prisma.projectMembers.create({
    data: {
      userId,
      projectId,
      access,
    },
  });
};

export const findProjectMember = (projectId: string, userId: string) => {
  return prisma.projectMembers.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};

export const removeMember = (projectId: string, userId: string) => {
  return prisma.projectMembers.delete({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};

export const checkUserAccess = (
  projectId: string,
  userId: string,
  requiredAccess: string[],
) => {
  return prisma.projectMembers.findFirst({
    where: {
      projectId,
      userId,
      access: { in: requiredAccess },
    },
  });
};

export const promoteMember = (
  projectId: string,
  userId: string,
  access: string,
) => {
  return prisma.projectMembers.updateMany({
    where: {
      projectId,
      userId,
    },
    data: {
      access,
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

export const getProjectMembers = (projectId: string) => {
  return prisma.projectMembers.findMany({
    where: {
      projectId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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

export const getPendingInvitationByEmail = (
  projectId: string,
  email: string,
) => {
  return prismaAny.projectInvitation.findFirst({
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
  return prismaAny.projectInvitation.create({
    data: {
      projectId,
      inviterId,
      email,
      access,
      inviteeId,
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
  return prismaAny.projectInvitation.findMany({
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
  return prismaAny.projectInvitation.findUnique({
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
  return prismaAny.projectInvitation.update({
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
  return prismaAny.projectInvitation.findMany({
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
