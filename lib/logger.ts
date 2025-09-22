import winston from 'winston';
import('winston-daily-rotate-file');

const { createLogger, format, transports, config } = winston;
const { combine, timestamp, printf, colorize, errors, json } = format;

const consoleFormat = combine(
    colorize({ all: true }), // ensure all levels are colorized
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => {
        return `
        Date: ${timestamp}  
        Level: ${level}\n
        Message: ${message}\n
        ${stack && `Stack: ${stack}`}`
    })
);

const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
);

// Transports
const consoleTransport = new transports.Console({ level: "debug", format: consoleFormat });

const fileTransport = (fileName: string, level = 'info', maxSize = '10m', maxFiles = '15d', datePattern = 'YYYY-MM-DD', format = fileFormat) =>
    new transports.DailyRotateFile({
        filename: fileName,
        datePattern: datePattern,
        maxSize: maxSize,
        maxFiles: maxFiles,
        level: level,
        format: format,
    });

const errorFileTransport = fileTransport('logs/errors/error-%DATE%.log', 'error');
const criticalTransport = fileTransport('logs/critical/critical-%DATE%.log', 'critical');
const exceptionFileTransport = fileTransport('logs/exceptions/exceptions-%DATE%.log');
const rejectionFileTransport = fileTransport('logs/rejections/rejections-%DATE%.log');

const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    defaultMeta: { env: process.env.NODE_ENV },
    transports: [
        consoleTransport,
        errorFileTransport,
        criticalTransport
    ],
    exceptionHandlers: [
        consoleTransport,
        exceptionFileTransport
    ],
    rejectionHandlers: [
        consoleTransport,
        rejectionFileTransport
    ]
});

module.exports = logger;
