import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import validator from "../middlewares/validator.middleware.js";
import {
  getAllUsersSchema,
  removeUserSchema,
  updateUserPasswordSchema,
} from "../validations/admin.validation.js";

const router = express.Router();

// View All Users & Tasks
router.post(
  "/users",
  validator(getAllUsersSchema),
  adminController.viewAllUsers
);

// Remove user
router.delete(
  "/remove-user",
  validator(removeUserSchema),
  adminController.removeUser
);

// Change  user password
router.patch(
  "/update-password",
  validator(updateUserPasswordSchema),
  adminController.updateUserPassword
);

export default router;
