import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import type { UpdateUserDTO } from "../dtos/user.dto.js";

export const updateUser = asyncWrapper(
  async (req: Request<{}, {}, UpdateUserDTO>, res: Response) => {
    const { id: userId } = req.user!;
    const updates = req.body;

    const result = await userService.updateUser(userId, updates);

    res.json({
      message: "User updated successfully",
      data: result,
    });
  },
);

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;

  await userService.deleteUser(userId);

  res.json({
    message: "User deleted successfully",
  });
});
