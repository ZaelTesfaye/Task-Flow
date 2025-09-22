import prisma from "../lib/prisma.js";

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

const userModel = {
  createUser,
  findByEmail,
};

export default userModel;
