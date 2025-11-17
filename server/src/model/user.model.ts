import prisma from "../lib/prisma.js";

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const updateUser = async (
  userId: string,
  updates: { name?: string; email?: string },
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: updates,
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
