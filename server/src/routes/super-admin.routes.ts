import express, { Router } from "express";
import { adminController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { addAdminSchema } from "../validations/index.js";

const router: Router = express.Router();

// create admin
router.post(
  "/create-admin",
  validatorMiddleware(addAdminSchema),
  adminController.addAdmin,
);

export default router;
