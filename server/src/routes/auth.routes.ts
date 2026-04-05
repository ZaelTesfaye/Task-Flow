import express, { Router } from "express";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AdminLoginRequestSchema,
  RequestPasswordResetRequestSchema,
  VerifyResetCodeRequestSchema,
  ResetPasswordRequestSchema,
} from "../schemas/index.js";
import { authController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router: Router = express.Router();

router.post("/register", validatorMiddleware(RegisterRequestSchema), authController.register);

router.post("/login", validatorMiddleware(LoginRequestSchema), authController.login);

router.post("/logout", authController.logout);

router.post(
  "/forgot-password",
  validatorMiddleware(RequestPasswordResetRequestSchema),
  authController.requestPasswordReset,
);

router.post("/verify-reset-code", validatorMiddleware(VerifyResetCodeRequestSchema), authController.verifyResetCode);

router.post("/reset-password", validatorMiddleware(ResetPasswordRequestSchema), authController.resetPassword);

export default router;
