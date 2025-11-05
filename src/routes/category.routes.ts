import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { validatorMiddleware } from "../middlewares/index.js";
import * as categorySchema from "../validations/category.validation.js";

const router = express.Router();

// create category
router.post(
  "/:projectId",
  validatorMiddleware(categorySchema.createCategorySchema),
  categoryController.createCategory,
);

// update category
router.patch(
  "/:projectId/:categoryId",
  validatorMiddleware(categorySchema.updateCategorySchema),
  categoryController.updateCategory,
);

// remove category
router.delete(
  "/:projectId/:categoryId",
  validatorMiddleware(categorySchema.removeCategorySchema),
  categoryController.removeCategory,
);

export default router;
