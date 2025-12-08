import express, { Router } from "express";
import {
  registerSchema,
  loginSchema,
  adminLoginSchema,
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

export default router;
