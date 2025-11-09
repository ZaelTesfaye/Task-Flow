import express from "express";
import { adminController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { addAdminSchema } from "../validations/index.js";

const router = express.Router();

// create admin
router.post(
  "/create-admin",
  validatorMiddleware(addAdminSchema),
  adminController.addAdmin,
);

export default router;
