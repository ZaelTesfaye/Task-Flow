import prisma from "../lib/prisma.js";

export const getAllUsers = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return prisma.user.findMany({
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      tasks: {
        select: {
          id: true,
          status: true,
          description: true,
        },
      },
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

export const createAdmin = (username: string, name: string, password: string) => {
  return prisma.user.create({
    data: {
      email: username,
      password: password,
      name: name,
      role: 'admin',  
    }
  });
}