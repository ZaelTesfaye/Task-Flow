import express, { Router } from "express";
import {
  createCheckoutSession,
  createPortalSession,
  webhook,
} from "../controllers/stripe.controller.js";
import { authMiddleware } from "../middlewares/index.js";

const router: Router = express.Router();

router.post("/subscribe", authMiddleware, createCheckoutSession);
router.post("/create-portal-session", authMiddleware, createPortalSession);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default router;
