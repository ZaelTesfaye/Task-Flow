import "dotenv/config.js";
import type http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "./config/config.js";
import {
  taskRoutes,
  authRoutes,
  categoryRoutes,
  projectRoutes,
  userRoutes,
  adminRoutes,
  superAdminRoutes,
} from "./routes/index.js";
import {
  authMiddleware,
  errorHandler,
  notFoundHandler,
} from "./middlewares/index.js";
import { logger } from "./lib/index.js";

const app = express();

app.set("view engine", "ejs");
app.set("trust proxy", true);

const allowedOrigins = config.frontEndUrl?.split(",")?.map((o) => o.trim());

console.log("Allowed Origins:", allowedOrigins);

// const corsOrigin = (origin, callback) => {
//   if (!origin || config.env === "development") {
//     return callback(null, true);  // Allow all in dev or non-browser requests
//   }

//   try {
//     const originUrl = new URL(origin);
//     const requestDomain = originUrl.hostname;  // Strips protocol, port, path
//     const isAllowed = allowedDomains.some((domain) => domain === requestDomain);

//     if (isAllowed) {
//       return callback(null, true);  // Allow and echo back the full origin
//     } else {
//       return callback(new Error(`Origin ${origin} not allowed`), false);
//     }
//   } catch (err) {
//     return callback(new Error('Invalid Origin'), false);
//   }
// };

const CorsOptions = {
  origin: config.env === "development" ? true : allowedOrigins, // corsOrigin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Authorization"],
};

app.use(cors(CorsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/super-admin", authMiddleware, superAdminRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/task", authMiddleware, taskRoutes);
app.use("/api/project", authMiddleware, projectRoutes);
app.use("/api/category", authMiddleware, categoryRoutes);
app.use("/api/user", authMiddleware, userRoutes);

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

// not found handler
app.use(notFoundHandler);

// global error handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
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
