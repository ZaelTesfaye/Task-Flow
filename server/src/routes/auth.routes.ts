import express, { Router } from "express";
import {
  registerSchema,
  adminLoginSchema,
  loginSchema,
} from "../validations/index.js";
import { authController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";

const router: Router = express.Router();

// register
router.post(
  "/register",
  validatorMiddleware(registerSchema),
  authController.register,
);

// admin login
router.post(
  "/admin-login",
  validatorMiddleware(adminLoginSchema),
  authController.login,
);

// login
router.post("/login", validatorMiddleware(loginSchema), authController.login);

// logout
router.post("/logout", authController.logout);

export default router;
