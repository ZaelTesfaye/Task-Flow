import express from "express";
import authSchema from "../validations/auth.validation.js";
import authController from "../controllers/auth.controller.js";
import validator from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post("/register", validator(authSchema.registerSchema), authController.register);

router.post("/login", validator(authSchema.loginSchema), authController.login);

router.get("/logout", authController.logout);

export default router;