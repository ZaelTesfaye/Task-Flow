import prisma from "../lib/prisma.js";

export const getAllUsers = (offset: number, limit: number) => {
  return prisma.user.findMany({
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });
};

export const deleteUser = (userId: string) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export const updateUserPassword = (userId: string, password: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
};
