import express, { type Express, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { register } from "prom-client";
import { toNodeHandler } from "better-auth/node";
import swaggerUi from "swagger-ui-express";
import { apiReference } from "@scalar/express-api-reference";

import { corsOptions } from "../config/index.js";
import { errorHandler, notFoundHandler, xssMiddleware, authMiddleware } from "../middlewares/index.js";
import { betterAuthStudio } from "better-auth-studio/express";
import { auth } from "../lib/auth.js";
import { studioConfig } from "../config/index.js";
import { generateOpenAPIDocument } from "../docs/openapi.js";

import {
  taskRoutes,
  userRoutes,
  projectRoutes,
  phaseRoutes,
  notificationRoutes,
  adminRoutes,
  stripeRoutes,
} from "../routes/index.js";

const expressLoader = (app: Express) => {
  app.set("view engine", "ejs");
  app.set("trust proxy", true);
  app.disable("x-powered-by");

  app.use(cors(corsOptions));
  app.use(cookieParser());

  const openApiDocument = generateOpenAPIDocument();

  app.get("/swagger.json", (_req: Request, res: Response) => {
    res.json(openApiDocument);
  });

  // Setup Swagger UI
  app.use("/api-docs", swaggerUi.serve);
  app.get(
    "/api-docs",
    swaggerUi.setup(openApiDocument, {
      customCss: ".swagger-ui { max-width: 100%; }",
      customSiteTitle: "TaskFlow API Docs",
    }),
  );

  // Setup Scalar UI
  app.get(
    "/api-reference",
    apiReference({
      url: "/swagger.json",
    }),
  );

  app.use("/api/auth", toNodeHandler(auth));
  app.use("/api/admin/studio", express.urlencoded({ extended: true }), express.json(), betterAuthStudio(studioConfig));

  app.use(express.static("public"));
  app.use((req, res, next) => {
    if (req.originalUrl === "/api/stripe/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(xssMiddleware);

  // API routes
  app.use("/api/task", authMiddleware, taskRoutes);
  app.use("/api/user", authMiddleware, userRoutes);
  app.use("/api/project", authMiddleware, projectRoutes);
  app.use("/api/phase", authMiddleware, phaseRoutes);
  app.use("/api/notification", authMiddleware, notificationRoutes);
  app.use("/api/admin", authMiddleware, adminRoutes);
  app.use("/api/stripe", authMiddleware, stripeRoutes);

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

  // error handler
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default expressLoader;