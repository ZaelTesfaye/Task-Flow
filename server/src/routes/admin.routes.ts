import express, { Router } from "express";
import { adminController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  GetAllUsersRequestSchema,
  RemoveUserRequestSchema,
  UpdateUserPasswordRequestSchema,
  AddAdminRequestSchema,
} from "../schemas/index.js";

const router: Router = express.Router();

router.get("/user/:page/:limit", validatorMiddleware(GetAllUsersRequestSchema), adminController.getAllUsers);

router.delete("/user/:userId", validatorMiddleware(RemoveUserRequestSchema), adminController.removeUser);

router.patch("/user", validatorMiddleware(UpdateUserPasswordRequestSchema), adminController.updateUserPassword);

router.post("/create-admin", validatorMiddleware(AddAdminRequestSchema), adminController.createAdmin);

export default router;
