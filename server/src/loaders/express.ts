import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { register } from "prom-client";
import { toNodeHandler } from "better-auth/node";
import { handleStudioRequest } from "better-auth-studio";

import {
  taskRoutes,
  authRoutes,
  phaseRoutes,
  projectRoutes,
  userRoutes,
  adminRoutes,
  stripeRoutes,
  notificationRoutes,
} from "../routes/index.js";
import { corsOptions } from "../config/index.js";
import { authMiddleware, errorHandler, notFoundHandler, xssMiddleware, authRateLimiter } from "../middlewares/index.js";
import { auth } from "../lib/auth.js";
import studioConfig from "../studio.config.js";

const expressLoader = (app: Express) => {
  app.set("view engine", "ejs");
  app.set("trust proxy", true);
  app.disable("x-powered-by");

  app.use(cors(corsOptions));

  app.use("/api/auth", toNodeHandler(auth));
  app.use("/api/admin/studio", express.urlencoded({ extended: true }), express.json(), async (req, res) => {
    const headers = Object.fromEntries(
      Object.entries(req.headers)
        .filter(([, value]) => value)
        .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    ) as Record<string, string>;

    const hasBody = req.body !== undefined && (typeof req.body !== "object" || Object.keys(req.body).length > 0);

    let body: string | undefined;
    if (hasBody) {
      if (typeof req.body === "string") {
        body = req.body;
      } else if (req.is("application/x-www-form-urlencoded")) {
        body = new URLSearchParams(
          Object.entries(req.body as Record<string, unknown>).map(([key, value]) => [key, String(value)]),
        ).toString();
      } else {
        body = JSON.stringify(req.body);
      }
    }

    const response = await handleStudioRequest(
      {
        method: req.method,
        url: req.originalUrl.replace("/api/admin/studio", "") || "/",
        headers,
        body,
      },
      studioConfig,
    );

    Object.entries(response.headers || {}).forEach(([key, value]) => {
      res.setHeader(key, value as string);
    });

    res.status(response.status).send(response.body);
  });
  app.use(express.static("public"));
  app.use((req, res, next) => {
    if (req.originalUrl === "/api/stripe/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(xssMiddleware);
  app.use(cookieParser());

  app.use("/api/admin", authMiddleware, adminRoutes);

  app.use("/api/custom-auth", authRateLimiter, authRoutes);
  app.use("/api/task", authMiddleware, taskRoutes);
  app.use("/api/project", authMiddleware, projectRoutes);
  app.use("/api/phase", authMiddleware, phaseRoutes);
  app.use("/api/user", authMiddleware, userRoutes);
  app.use("/api/notification", authMiddleware, notificationRoutes);
  app.use("/api/stripe", stripeRoutes);

  // ejs
  app.get("/home", (req, res) => {
    res.render("index", {
      title: "Task Manager",
      message: "Welcome to the Task Manager Application!",
    });
  });

  // health check
  app.get("/api/health", (req, res) => {
    res.send("Ok!");
  });

  // metrics
  app.get("/api/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  // not found handler
  app.use(notFoundHandler);

  // global error handler
  app.use(errorHandler);

  return app;
};

export default expressLoader;
