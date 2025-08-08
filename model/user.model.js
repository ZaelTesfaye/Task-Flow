const prisma = require("../lib/prisma");

const addUser = async (name) => {
  return await prisma.user.create({
    data: {
      name,
    },
  });
};

module.exports = {
    addUser
}