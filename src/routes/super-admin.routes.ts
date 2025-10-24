import express from "express";
import { addAdmin } from "../controllers/admin.controller.js";
import validator from "../middlewares/validator.middleware.js"
import { addAdminSchema } from "../validations/admin.validation.js";

const router = express.Router();

router.post("add-admin", validator(addAdminSchema), addAdmin);

export default router;