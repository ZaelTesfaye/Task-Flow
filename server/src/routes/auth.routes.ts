import express, { Router } from "express";
import {
  registerSchema,
  loginSchema,
  adminLoginSchema,
  requestPasswordResetSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from "../validations/index.js";
import { authController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router: Router = express.Router();

// admin login
router.post(
  "/login",
  validatorMiddleware(adminLoginSchema),
  authController.login,
);

// register
router.post(
  "/register",
  validatorMiddleware(registerSchema),
  authController.register,
);

// login
router.post("/login", validatorMiddleware(loginSchema), authController.login);

// logout
router.post("/logout", authController.logout);

// Request password reset (send code to email)
router.post(
  "/forgot-password",
  validatorMiddleware(requestPasswordResetSchema),
  authController.requestPasswordReset,
);

// Verify reset code
router.post(
  "/verify-reset-code",
  validatorMiddleware(verifyResetCodeSchema),
  authController.verifyResetCode,
);

// Reset password
router.post(
  "/reset-password",
  validatorMiddleware(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
