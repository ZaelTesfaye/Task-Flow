import { userModel } from "../model/index.js";
import type { UpdateUserDTO } from "../dtos/index.js";

export const updateUser = async (userId: string, updates: UpdateUserDTO) => {
  return userModel.updateUser(userId, updates);
};

export const deleteUser = async (userId: string) => {
  return userModel.deleteUser(userId);
};
