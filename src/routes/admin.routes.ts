import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import validator from "../middlewares/validator.middleware.js";
import { getAllUsersSceham } from "../validations/admin.validation.js";

const router = express.Router();

// View All Users & Tasks
router.post(
  "/users",
  validator(getAllUsersSceham),
  adminController.viewAllUsers
);

// Create User
router.post("/add-user", adminController.addUser);

// Remove user
router.delete("/remove-user", adminController.removeUser);

// Suspend User
router.patch("/update-user-status", adminController.updateUserStatus);

// Blacklist token
router.post("black-list-token", adminController.blacklistToken);

export default router;
