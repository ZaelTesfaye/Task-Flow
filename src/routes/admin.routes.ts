import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import validator from "../middlewares/validator.middleware.js";
import {
  getAllUsersSchema,
  removeUserSchema,
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

// Suspend User
router.patch("/update-user-status", adminController.updateUserStatus);

// Blacklist token
router.post("black-list-token", adminController.blacklistToken);

export default router;
