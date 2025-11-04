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
