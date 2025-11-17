import express, { Router } from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import { updateUserSchema } from "../validations/index.js";
import { userController } from "../controllers/index.js";

const router: Router = express.Router();

// Update user
router.patch(
  "/",
  validatorMiddleware(updateUserSchema),
  userController.updateUser,
);

// Delete user
router.delete(
  "/",
  // No input requried
  userController.deleteUser,
);

export default router;
