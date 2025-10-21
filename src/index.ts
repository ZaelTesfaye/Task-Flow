import dotenv from "dotenv/config.js";
import type http from "http";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import type { Request, Response, NextFunction } from "express";
import { APIError } from "./utils/error.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import config from "./config/config.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import cors from 'cors';

const app = express();

const CorsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
};

app.set("view engine", "ejs");
app.use(cors(CorsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.get("/api/health", (req, res) => {
  console.log(`Health check on container ${process.env.CONTAINER_NAME}`);
  res.send("OK");
});

// ejs
app.get("/home", (req, res) => {
  console.log("Serving home page");
  res.render("index", {
    title: "Task Manager",
    message: "Welcome to the Task Manager Application!",
  });
});

app.use((req, res) => {
  res.status(404).send("Not Found!");
});

app.use(
  (
    error: Error | APIError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(error);

    if (error instanceof APIError) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("An error occurred");
  }
);

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const io = new Server(server, {
  cors: {
    origin:[config.env === "dev" ? "locahost:3000" : config.frontEndUrl],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  console.log("Socket connection established: ", socket);
});

const exitHandler = (serverInstance: http.Server | undefined) => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log("Server closed gracefully");
      process.exit(1);
    });
  } else {
    console.log("Server exit");
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  console.error(error);
  exitHandler(server);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
  exitHandler(server);
});
