import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import express from "express";
import type { Server } from "node:http";

vi.mock("better-auth/node", () => ({
  toNodeHandler: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock("better-auth-studio", () => ({
  handleStudioRequest: async () => ({
    status: 200,
    headers: {},
    body: "",
  }),
}));

vi.mock("../../src/routes/index.js", () => {
  const noop = (_req: unknown, _res: unknown, next: () => void) => next();

  return {
    taskRoutes: noop,
    authRoutes: noop,
    phaseRoutes: noop,
    projectRoutes: noop,
    userRoutes: noop,
    adminRoutes: noop,
    superAdminRoutes: noop,
    stripeRoutes: noop,
    notificationRoutes: noop,
  };
});

vi.mock("../../src/config/index.js", () => ({
  corsOptions: {},
}));

vi.mock("../../src/middlewares/index.js", () => {
  const noop = (_req: unknown, _res: unknown, next: () => void) => next();

  return {
    authMiddleware: (_req: unknown, res: any, next: () => void) => {
      // Simulate unauthorized for protected routes
      res.status(401).json({ message: "Unauthorized" });
    },
    xssMiddleware: noop,
    authRateLimiter: noop,
    notFoundHandler: (_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }) => {
      res.status(404).json({ message: "Not Found!" });
    },
    errorHandler: (
      _err: unknown,
      _req: unknown,
      res: { status: (code: number) => { json: (body: unknown) => void } },
      _next: () => void,
    ) => {
      void _next;
      res.status(500).json({ message: "An error occurred" });
    },
  };
});

vi.mock("../../src/lib/auth.js", () => ({
  auth: {},
}));

vi.mock("../../src/studio.config.js", () => ({
  default: {},
}));

import expressLoader from "../../src/loaders/express.js";

describe("Protected Routes Authorization", () => {
  let server: Server;

  beforeAll(() => {
    const app = express();
    expressLoader(app);
    server = app.listen(0);
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it("returns 401 Unauthorized when accessing protected route without credentials", async () => {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Server address is not available");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/task`, {
      method: "GET",
    });

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.message).toBe("Unauthorized");
  });
});
