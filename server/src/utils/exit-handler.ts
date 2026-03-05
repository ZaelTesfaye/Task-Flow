import logger from "../lib/logger.js";
import type http from "http";

const exitHandler = (serverInstance: http.Server | undefined) => {
  if (serverInstance) {
    serverInstance.close(() => {
      logger.critical("Server closed gracefully");
      process.exit(0);
    });
  } else {
    logger.critical("No server instance. Process exited");
    process.exit(1);
  }
};

export default exitHandler;
