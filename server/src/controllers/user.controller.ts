import type { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../lib/index.js";
import { userServices } from "../services/index.js";
import type { UpdateUserDTO } from "../dtos/index.js";

export const updateUser: RequestHandler = asyncWrapper(
  async (req: Request<{}, {}, UpdateUserDTO>, res: Response) => {
    const { id: userId } = req.user!;
    const updates = req.body;

    const result = await userServices.updateUser(userId, updates);

    res.json({
      message: "User updated successfully",
      data: result,
    });
  },
);

export const deleteUser: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;

    await userServices.deleteUser(userId);

    res.json({
      message: "User deleted successfully",
    });
  },
);
