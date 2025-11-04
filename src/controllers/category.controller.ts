import asyncWrapper from "../lib/asyncWrapper.js";
import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.js";
import * as projectService from "../services/project.service.js";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../dtos/category.dto.js";

export const createCategory = asyncWrapper(
  async (
    req: Request<{ projectId: string }, {}, CreateCategoryDTO>,
    res: Response,
  ) => {
    const { projectId } = req.params;
    const { id: userId } = req.user!;
    const { name } = req.body;

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can create categories",
      });
    }

    const result = await categoryService.createCategory(name, projectId);

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

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can update categories",
      });
    }

    const result = await categoryService.updateCategory(categoryId, updates);

    res.json({
      message: "Category updated successfully",
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

    const hasAccess = await projectService.checkUserAccess(projectId, userId, [
      "owner",
      "admin",
    ]);
    if (!hasAccess) {
      return res.status(403).json({
        message: "Only project owner or admin can remove categories",
      });
    }

    await categoryService.removeCategory(categoryId, projectId);

    res.json({
      message: "Category removed successfully",
    });
  },
);
