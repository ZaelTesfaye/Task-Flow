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

  const result = await adminModel.updateUserPassword(userId, hashedPassword);

  if (result.count > 0) {
    return result;
  } else {
    return null;
  }
};
