import "dotenv/config.js";

import express from "express";
import http from "http";

import config from "./config/env.config.js";
import { logger } from "./lib/index.js";
import { exitHandler } from "./utils/index.js";
import loader from "./loaders/index.js";

const startServer = () => {
  const app = express();

  loader(app);

  const httpServer = http.createServer(app);

  const server = httpServer.listen(config.port, () => {
    logger.info(`server listening on port ${config.port}`);
  });

  process.on("uncaughtException", (error) => {
    logger.error("uncaughtException", error);
    exitHandler(server);
  });

  process.on("unhandledRejection", (error) => {
    logger.error("unhandledRejection", error);
    exitHandler(server);
  });

  process.on("SIGTERM", () => {
    exitHandler(server);
  });

  process.on("SIGINT", () => {
    exitHandler(server);
  });
};

startServer();
