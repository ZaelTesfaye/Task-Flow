import prisma from "../lib/prisma.js";

const addUser = async (name: string, email: string, password: string) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password
    },
  });
};

const userServices = {
    addUser
}

export default userServices;