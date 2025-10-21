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
                status : true,
                description: true
            },
        }
    }
  });
};
