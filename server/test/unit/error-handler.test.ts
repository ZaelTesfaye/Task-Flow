import { describe, expect, it, vi } from "vitest";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";

// Mock config before importing utilities
vi.mock("../../src/config/env.config.js", () => ({
  default: { jwtSecret: "test-secret", resendApiKey: "test-key" },
}));

vi.mock("../../src/lib/logger.js", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("../../src/lib/email.js", () => ({
  default: { emails: { send: vi.fn() } },
}));

import errorHandler from "../../src/middlewares/error-handler.js";
import { APIError } from "../../src/utils/index.js";

describe("errorHandler middleware", () => {
  it("returns statusCode and message for APIError", () => {
    const error = new APIError("User not found", httpStatus.NOT_FOUND);
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandler(error, {} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("handles Prisma unique constraint violation (P2002)", () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "5.0.0",
    });
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandler(prismaError, {} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(httpStatus.CONFLICT);
    expect(res.json).toHaveBeenCalledWith({ message: "Resource already exists" });
  });

  it("handles generic Error with 500 status", () => {
    const error = new Error("Unknown error");
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandler(error, {} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ message: "An error occurred" });
  });
});
