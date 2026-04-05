import express, { Router } from "express";
import { validatorMiddleware } from "../middlewares/index.js";
import { UpdateUserRequestSchema } from "../schemas/index.js";
import { userController } from "../controllers/index.js";

const router: Router = express.Router();

router.get("/me", userController.getMe);

router.patch("/", validatorMiddleware(UpdateUserRequestSchema), userController.updateUser);

router.delete("/", userController.deleteUser);

export default router;
