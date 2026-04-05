import express, { Router } from "express";
import { phaseController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { CreatePhaseRequestSchema, UpdatePhaseRequestSchema, RemovePhaseRequestSchema } from "../schemas/index.js";

const router: Router = express.Router();

router.post("/:projectId", validatorMiddleware(CreatePhaseRequestSchema), phaseController.createPhase);

router.get("/:projectId", phaseController.getPhases);

router.patch("/:projectId/:phaseId", validatorMiddleware(UpdatePhaseRequestSchema), phaseController.updatePhase);

router.delete("/:projectId/:phaseId", validatorMiddleware(RemovePhaseRequestSchema), phaseController.removePhase);

export default router;
