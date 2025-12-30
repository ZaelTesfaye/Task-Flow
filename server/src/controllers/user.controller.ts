import type { Request, Response, RequestHandler } from "express";
import { asyncWrapper, redis } from "../lib/index.js";
import { userServices } from "../services/index.js";
import type { UpdateUserDTO } from "../dtos/index.js";

export const updateUser: RequestHandler = asyncWrapper(
  async (req: Request<{}, {}, UpdateUserDTO>, res: Response) => {
    const { id: userId } = req.user!;
    const updates = req.body;

    const result = await userServices.updateUser(userId, updates);

    // Invalidate user profile cache
    await redis.del(`user:${userId}:profile`);

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

    // Invalidate user profile cache
    await redis.del(`user:${userId}:profile`);

    res.json({
      message: "User deleted successfully",
    });
  },
);

export const getMe: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user!;

    const cacheKey = `user:${userId}:profile`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }

    const user = await userServices.getUserById(userId);

    await redis.set(cacheKey, JSON.stringify(user), "EX", 60);

    res.json(user);
  },
);
