import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { validatorMiddleware } from "../middlewares/index.js";
import * as categorySchema from "../validations/category.validation.js";

const router = express.Router();

router.post(
  "/create-category/:projectId",
  validatorMiddleware(categorySchema.createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/update-category/:projectId/:categoryId",
  validatorMiddleware(categorySchema.updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/remove-category/:projectId/:categoryId",
  validatorMiddleware(categorySchema.removeCategorySchema),
  categoryController.removeCategory,
);

export default router;
