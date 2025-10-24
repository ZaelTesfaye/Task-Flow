import express from "express";
import { addAdmin } from "../controllers/admin.controller.js";
import {validatorMiddleware} from "../middlewares/index.js"
import { addAdminSchema } from "../validations/admin.validation.js";

const router = express.Router();

router.post("/add-admin", validatorMiddleware(addAdminSchema), addAdmin);

export default router;