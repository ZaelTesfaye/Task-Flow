import dotenv from "dotenv/config.js";
import type http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import { APIError } from "./utils/error.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import config from "./config/config.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import logger from "./lib/logger.js";
import errorHandler from "./middlewares/error-handler.js";

const app = express();

const CorsOptions = {
  origin: [
    `${
      config.env === "development"
        ? "http://localhost:3000"
        : config.frontEndUrl
    } `,
  ],
};

app.set("view engine", "ejs");
app.use(cors(CorsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/admin", authMiddleware, adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.get("/api/health", (req, res) => {
  console.log(`Requested container: ${process.env.CONTAINER_NAME}`);
  res.send("Ok!");
});

// ejs
app.get("/home", (req, res) => {
  res.render("index", {
    title: "Task Manager",
    message: "Welcome to the Task Manager Application!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Not Found!",
  });
});

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
  console.error("uncaughtException", error);
  exitHandler(server);
});

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error);
  exitHandler(server);
});
