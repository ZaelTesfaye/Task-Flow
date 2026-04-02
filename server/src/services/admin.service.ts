import bcrypt from "bcrypt";
import { adminModel } from "../model/index.js";
import { userModel } from "../model/index.js";

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
  return adminModel.updateUserPassword(userId, hashedPassword);
};
