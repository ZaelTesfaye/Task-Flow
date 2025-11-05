import * as userModel from "../model/user.model.js";
import type { UpdateUserDTO } from "../dtos/user.dto.js";

export const updateUser = async (userId: string, updates: UpdateUserDTO) => {
  return userModel.updateUser(userId, updates);
};

export const deleteUser = async (userId: string) => {
  return userModel.deleteUser(userId);
};
