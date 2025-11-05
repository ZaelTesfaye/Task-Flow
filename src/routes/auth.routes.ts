import express from "express";
import authSchema from "../validations/auth.validation.js";
import * as authController from "../controllers/auth.controller.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router = express.Router();

// register
router.post(
  "/register",
  validatorMiddleware(authSchema.registerSchema),
  authController.register,
);

// admin login
router.post(
  "/admin-login",
  validatorMiddleware(authSchema.adminLoginSchema),
  authController.login,
);

// login
router.post(
  "/login",
  validatorMiddleware(authSchema.loginSchema),
  authController.login,
);

// logout
router.get("/logout", authController.logout);

export default router;
