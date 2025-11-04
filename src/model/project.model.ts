import prisma from "../lib/prisma.js";

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
