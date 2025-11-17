import express, { Router } from "express";
import { adminController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  getAllUsersSchema,
  removeUserSchema,
  updateUserPasswordSchema,
} from "../validations/index.js";

const router: Router = express.Router();

// View All Users & Tasks
router.get(
  "/user/:page/:limit",
  validatorMiddleware(getAllUsersSchema),
  adminController.getAllUsers,
);

// Remove user
router.delete(
  "/user/:userId",
  validatorMiddleware(removeUserSchema),
  adminController.removeUser,
);

// Change user password
router.patch(
  "/user",
  validatorMiddleware(updateUserPasswordSchema),
  adminController.updateUserPassword,
);

export default router;
