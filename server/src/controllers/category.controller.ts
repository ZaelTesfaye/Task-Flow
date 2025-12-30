import type { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncWrapper, redis } from "../lib/index.js";
import { categoryServices, projectServices } from "../services/index.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/index.js";

export const createCategory = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, CreateCategoryDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const { name } = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can create categories",
      });
    }

    const result = await categoryServices.createCategory(name, projectId);

    // Invalidate categories cache
    await redis.del(`project:${projectId}:categories`);

    res.json({
      message: "Category created successfully",
      data: result,
    });
  },
);

export const updateCategory = asyncWrapper(
  async (
    req: Request<
      { projectId: string; categoryId: string },
      {},
      UpdateCategoryDTO
    >,
    res: Response,
  ) => {
    const { projectId, categoryId } = req.params;
    const { id: userId } = req.user!;
    const updates = req.body;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can update categories",
      });
    }

    const result = await categoryServices.updateCategory(categoryId, updates);

    // Invalidate categories cache
    await redis.del(`project:${projectId}:categories`);

    res.json({
      message: "Category updated successfully",
      data: result,
    });
  },
);

export const getCategories = asyncWrapper(
  async (req: Request<{ projectId: string }>, res: Response) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
      "member",
    ]);

    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project members can view categories",
      });
    }

    const cacheKey = `project:${projectId}:categories`;
    const cachedCategories = await redis.get(cacheKey);

    if (cachedCategories) {
      return res.json({
        message: "Categories retrieved successfully",
        data: JSON.parse(cachedCategories),
      });
    }

    const categories = await categoryServices.getCategories(projectId);
    const project = await projectServices.getProjectById(projectId);

    const result = {
      project,
      categories,
    };

    await redis.set(
      `project:${projectId}:categories`,
      JSON.stringify(result),
      "EX",
      60,
    );

    res.json({
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);
export const removeCategory = asyncWrapper(
  async (
    req: Request<{ projectId: string; categoryId: string }>,
    res: Response,
  ) => {
    const { projectId, categoryId } = req.params;
    const { id: userId } = req.user!;

    const hasAccess = await projectServices.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Only project owner or admin can remove categories",
      });
    }

    await categoryServices.removeCategory(categoryId, projectId);

    // Invalidate categories cache
    await redis.del(`project:${projectId}:categories`);

    res.json({
      message: "Category removed successfully",
    });
  },
);
