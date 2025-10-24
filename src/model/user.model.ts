import prisma from "../lib/prisma.js";

export const createUser = async (name: string, email: string, password: string) => {
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

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    }
  })
}

export const userModel = {
  createUser,
  findByEmail,
  getUser,
};

export default userModel;
