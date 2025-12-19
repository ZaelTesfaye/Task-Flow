import bcrypt from "bcrypt";
import { adminModel } from "../model/index.js";
import { userModel } from "../model/index.js";

export const getAllUsers = (page: number, limit: number) => {
  return adminModel.getAllUsers(page, limit);
};

export const removeUser = async (userId: string, userRole: string) => {
  const deleteUser = await userModel.findById(userId);
  if (!deleteUser) throw new Error("User not found");

  if (deleteUser.role === "super-admin")
    throw new Error("Cannot delete super-admin user");

  if (deleteUser.role === "admin" && userRole !== "super-admin")
    throw new Error("Only super-admin can delete admin users");

  return adminModel.deleteUser(userId);
};

export const updateUserPassword = async (userId: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return adminModel.updateUserPassword(userId, hashedPassword);
};
