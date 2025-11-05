import express from "express";
import { categoryController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  createCategorySchema,
  updateCategorySchema,
  removeCategorySchema,
} from "../validations/index.js";

const router = express.Router();

// create category
router.post(
  "/:projectId",
  validatorMiddleware(createCategorySchema),
  categoryController.createCategory,
);

// update category
router.patch(
  "/:projectId/:categoryId",
  validatorMiddleware(updateCategorySchema),
  categoryController.updateCategory,
);

// remove category
router.delete(
  "/:projectId/:categoryId",
  validatorMiddleware(removeCategorySchema),
  categoryController.removeCategory,
);

export default router;
