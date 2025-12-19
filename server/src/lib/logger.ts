import "winston-daily-rotate-file";
import winston from "winston";
import config from "../config/config.js";

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

const jsonFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  json(),
);

// Transports
const consoleTransport = new transports.Console({
  level: config.env === "development" ? "debug" : "info",
  format: config.env === "development" ? prettyFormat : jsonFormat,
});

const logger = createLogger({
  levels: logLevels,
  level: config.env === "development" ? "debug" : "info",
  defaultMeta: { env: config.env },
  transports: [consoleTransport],
  exceptionHandlers: [consoleTransport],
  rejectionHandlers: [consoleTransport],
});

export default logger;

//  File Logs in Json & Console logs in Pretty Format With winston && Winston-Daily-Rotate-File

// import "winston-daily-rotate-file";
// import winston from "winston";

// const { createLogger, format, transports } = winston;
// const { combine, timestamp, printf, colorize, errors, json } = format;

// const consoleFormat = combine(
//   colorize({ all: true }),
//   timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//   errors({ stack: true }),
//   printf(({ timestamp, level, message, stack }) => {
//     return `Date: ${timestamp}
//       Level: ${level}
//       Message: ${message}
//       ${stack ? `Stack: ${stack}` : ""}`;
//   }),
// );

// const fileFormat = combine(
//   timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//   errors({ stack: true }),
//   json(),
// );

// // Transports
// const consoleTransport = new transports.Console({
//   level: "debug",
//   format: consoleFormat,
// });

// const fileTransport = (
//   fileName: string,
//   level = "info",
//   maxSize = "10m",
//   maxFiles = "15d",
//   datePattern = "YYYY-MM-DD",
//   format = fileFormat,
// ) =>
//   new transports.DailyRotateFile({
//     filename: fileName,
//     datePattern: datePattern,
//     maxSize: maxSize,
//     maxFiles: maxFiles,
//     level: level,
//     format: format,
//   });

// const errorFileTransport = fileTransport(
//   "logs/errors/error-%DATE%.log",
//   "error",
// );
// const criticalTransport = fileTransport(
//   "logs/critical/critical-%DATE%.log",
//   "critical",
// );
// const exceptionFileTransport = fileTransport(
//   "logs/exceptions/exceptions-%DATE%.log",
// );
// const rejectionFileTransport = fileTransport(
//   "logs/rejections/rejections-%DATE%.log",
// );

// const logLevels = {
//   critical: 0,
//   error: 1,
//   warn: 2,
//   info: 3,
//   debug: 4,
// };

// const logColors = {
//   critical: "red",
//   error: "red",
//   warn: "yellow",
//   info: "green",
//   debug: "blue",
// };

// // Add colors to winston
// winston.addColors(logColors);

// const logger = createLogger({
//   levels: logLevels,
//   level: process.env.NODE_ENV === "development" ? "debug" : "info",
//   defaultMeta: { env: process.env.NODE_ENV },
//   transports: [consoleTransport, errorFileTransport, criticalTransport],
//   exceptionHandlers: [consoleTransport, exceptionFileTransport],
//   rejectionHandlers: [consoleTransport, rejectionFileTransport],
// });

// export default logger;
