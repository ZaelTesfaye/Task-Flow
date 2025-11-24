import prisma from "../lib/prisma.js";

export const createCategory = (name: string, projectId: string) => {
  return prisma.category.create({
    data: {
      name,
      projectId,
    },
  });
};

export const updateCategory = (
  categoryId: string,
  updates: { name?: string },
) => {
  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updates,
  });
};

export const getCategories = (projectId: string) => {
  return prisma.category.findMany({
    where: {
      projectId,
    },
    include: {
      tasks: {
        include: {
          pendingUpdates: true,
          assignedUser: {
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

export const getCategory = (categoryId: string, projectId: string) => {
  return prisma.category.findUnique({
    where: {
      id: categoryId,
      projectId,
    },
  });
};

export const removeCategory = (categoryId: string, projectId: string) => {
  return prisma.category.delete({
    where: {
      id: categoryId,
      projectId,
    },
  });
};
