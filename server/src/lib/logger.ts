import "winston-daily-rotate-file";
import winston from "winston";
import { env } from "../config/index.js";

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors, json } = format;

const logLevels = {
  critical: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const logColors = {
  critical: "red",
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

winston.addColors(logColors);

const prettyFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `Date: ${timestamp}  
      Level: ${level}
      Message: ${message}
      ${stack ? `Stack: ${stack}` : ""}`;
  }),
);

const jsonFormat = combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), json());

// Transports
const consoleTransport = new transports.Console({
  level: env.nodeEnv === "development" ? "debug" : "info",
  format: env.nodeEnv === "development" ? prettyFormat : jsonFormat,
});

const logger = createLogger({
  levels: logLevels,
  level: env.nodeEnv === "development" ? "debug" : "info",
  defaultMeta: { env: env.nodeEnv },
  transports: [consoleTransport],
  exceptionHandlers: [consoleTransport],
  rejectionHandlers: [consoleTransport],
});

export default logger;
