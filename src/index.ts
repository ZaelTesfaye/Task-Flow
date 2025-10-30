import "dotenv/config.js";
import type http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import config from "./config/config.js";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import superAdminRoutes from "./routes/super-admin.routes.js";
import logger from "./lib/logger.js";
import {
  authMiddleware,
  errorHandler,
  notFoundHandler,
} from "./middlewares/index.js";

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

app.use("/super-admin", authMiddleware, superAdminRoutes);
app.use("/admin", authMiddleware, adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

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
