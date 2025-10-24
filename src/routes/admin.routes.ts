import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import {validatorMiddleware} from "../middlewares/index.js";
import {
  getAllUsersSchema,
  removeUserSchema,
  updateUserPasswordSchema,
} from "../validations/admin.validation.js";

const router = express.Router();

// View All Users & Tasks
router.post(
  "/users",
  validatorMiddleware(getAllUsersSchema),
  adminController.viewAllUsers
);

// Remove user
router.delete(
  "/remove-user",
  validatorMiddleware(removeUserSchema),
  adminController.removeUser
);

// Change  user password
router.patch(
  "/update-password",
  validatorMiddleware(updateUserPasswordSchema),
  adminController.updateUserPassword
);

export default router;
