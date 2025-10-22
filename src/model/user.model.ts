import prisma from "../lib/prisma.ts";

const createUser = async (name: string, email: string, password: string) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    }
  })
}

const userModel = {
  createUser,
  findByEmail,
  getUser,
};

export default userModel;
