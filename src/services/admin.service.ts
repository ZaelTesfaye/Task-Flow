import * as adminModel from "../model/admin.model.js";
import bcrypt from "bcrypt";
export const getAllUsers = (page: number, limit: number) => {
  return adminModel.getAllUsers(page, limit);
};

export const removeUser = (userId: string) => {
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
