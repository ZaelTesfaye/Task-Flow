import express from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import * as userSchema from "../validations/user.validation.js";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

// Update user
router.patch(
  "/",
  validatorMiddleware(userSchema.updateUserSchema),
  userController.updateUser,
);

// Delete user
router.delete(
  "/",
  // No input requried
  userController.deleteUser,
);

export default router;
