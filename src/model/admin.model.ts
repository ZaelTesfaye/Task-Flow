import prisma from "../lib/prisma.ts";

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
                status : true,
                description: true
            },
        }
    }
  });
};


export const deleteUser = (userId: string) => {
  return prisma.user.deleteMany({
    where: {
      id: userId
    },
  })
};