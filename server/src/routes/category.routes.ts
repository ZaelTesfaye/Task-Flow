import express, { Router } from "express";
import { phaseController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import { CreatePhaseRequestSchema, UpdatePhaseRequestSchema, RemovePhaseRequestSchema } from "../schemas/index.js";

const router: Router = express.Router();

// create phase
router.post("/:projectId", validatorMiddleware(CreatePhaseRequestSchema), phaseController.createPhase);

// update phase
router.patch("/:projectId/:phaseId", validatorMiddleware(UpdatePhaseRequestSchema), phaseController.updatePhase);

router.get("/:projectId", phaseController.getPhases);

// remove phase
router.delete("/:projectId/:phaseId", validatorMiddleware(RemovePhaseRequestSchema), phaseController.removePhase);

export default router;
