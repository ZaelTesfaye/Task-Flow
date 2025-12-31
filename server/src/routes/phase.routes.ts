import express, { Router } from "express";
import { phaseController } from "../controllers/index.js";
import { validatorMiddleware } from "../middlewares/index.js";
import {
  createPhaseSchema,
  updatePhaseSchema,
  removePhaseSchema,
} from "../validations/index.js";

const router: Router = express.Router();

// create phase
router.post(
  "/:projectId",
  validatorMiddleware(createPhaseSchema),
  phaseController.createPhase,
);

// update phase
router.patch(
  "/:projectId/:phaseId",
  validatorMiddleware(updatePhaseSchema),
  phaseController.updatePhase,
);

router.get("/:projectId", phaseController.getPhases);

// remove phase
router.delete(
  "/:projectId/:phaseId",
  validatorMiddleware(removePhaseSchema),
  phaseController.removePhase,
);

export default router;
