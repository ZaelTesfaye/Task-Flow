import prisma from "../lib/prisma.js";

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

export const findMember = (projectId: string, userId: string) => {
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

export const getProjectMemberWithAccess = (
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

export const updateMemberAccess = (
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
