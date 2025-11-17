import bcrypt from "bcrypt";
import { adminModel } from "../model/index.js";
import { userModel } from "../model/index.js";

export const getAllUsers = (page: number, limit: number) => {
  return adminModel.getAllUsers(page, limit);
};

export const removeUser = async (userId: string, userRole: string) => {
  const deleteUser = await userModel.findById(userId);
  if (!deleteUser) throw new Error("User not found");

  if (deleteUser.role === "owner") throw new Error("Cannot delete owner user");

  if (deleteUser.role === "admin" && userRole !== "owner")
    throw new Error("Only owner can delete admin users");

  return adminModel.deleteUser(userId);
};

export const updateUserPassword = async (userId: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return adminModel.updateUserPassword(userId, hashedPassword);
};

export const addAdmin = async (
  username: string,
  name: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return adminModel.createAdmin(username, name, hashedPassword);
};
