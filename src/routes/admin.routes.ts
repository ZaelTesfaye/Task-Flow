import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  getAllUsersSchema,
  removeUserSchema,
  updateUserPasswordSchema,
} from "../validations/admin.validation.js";

const router = express.Router();

// View All Users & Tasks
router.get(
  "/user/:page/:limit",
  validatorMiddleware(getAllUsersSchema),
  adminController.viewAllUsers,
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
