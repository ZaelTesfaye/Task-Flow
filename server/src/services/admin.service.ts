import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { adminModel } from "../model/index.js";
import { userModel } from "../model/index.js";
import prisma from "../lib/prisma.js";

export const getAllUsers = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return adminModel.getAllUsers(offset, limit);
};

export const removeUser = async (userId: string, userRole: string) => {
  const deleteUser = await userModel.findById(userId);

  if (!deleteUser) throw new Error("User not found");

  if (deleteUser.role === "admin") throw new Error("Cannot delete admin user");

  return adminModel.deleteUser(userId);
};

export const updateUserPassword = async (userId: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await adminModel.updateUserPassword(userId, hashedPassword);
  if (result.count === 0) {
    throw new Error("Credential account not found for user");
  }
  return result;
};

export const createAdmin = async (email: string, name: string, password: string) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await userModel.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email: normalizedEmail,
      name,
      role: "admin",
      emailVerified: true,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: normalizedEmail,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};
