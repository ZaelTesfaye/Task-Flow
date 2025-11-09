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

export const removeCategory = (categoryId: string, projectId: string) => {
  return prisma.category.delete({
    where: {
      id: categoryId,
      projectId,
    },
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

export const validateCategoryBelongsToProject = (
  categoryId: string,
  projectId: string,
) => {
  return prisma.category.findFirst({
    where: {
      id: categoryId,
      projectId,
    },
  });
};
