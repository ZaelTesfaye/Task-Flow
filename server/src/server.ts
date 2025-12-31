import "dotenv/config.js";
import type http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { register, collectDefaultMetrics } from "prom-client";

import config from "./config/config.js";
import {
  taskRoutes,
  authRoutes,
  phaseRoutes,
  projectRoutes,
  userRoutes,
  adminRoutes,
  superAdminRoutes,
  stripeRoutes,
  notificationRoutes,
} from "./routes/index.js";
import {
  authMiddleware,
  errorHandler,
  notFoundHandler,
} from "./middlewares/index.js";
import { logger } from "./lib/index.js";

const app = express();

collectDefaultMetrics();

app.set("view engine", "ejs");
app.set("trust proxy", true);

const allowedOrigins = config.frontEndUrl?.split(",")?.map((o) => o.trim());

const CorsOptions = {
  origin: config.env === "development" ? true : allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(CorsOptions));

// app.use("/api/auth", toNodeHandler(auth));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.static("public"));
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cookieParser());

app.use("/api/super-admin", authMiddleware, superAdminRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

app.use("/api/custom-auth", authRoutes);
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

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);

  // Verify email configuration
  if (config.resendApiKey && config.resendApiKey.startsWith("re_")) {
    logger.info("✅ Email service configured (Resend API key detected)");
  } else {
    logger.warn(
      "⚠️ Email service NOT configured - Add RESEND_API_KEY to .env file",
    );
    logger.warn("   Get your API key from https://resend.com");
  }
});

const exitHandler = (serverInstance: http.Server | undefined) => {
  if (serverInstance) {
    serverInstance.close(() => {
      logger.critical("Server closed gracefully");
      process.exit(1);
    });
  } else {
    logger.critical("Server exit");
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  logger.error("uncaughtException", error);
  exitHandler(server);
});

process.on("unhandledRejection", (error) => {
  logger.error("unhandledRejection", error);
  exitHandler(server);
});
