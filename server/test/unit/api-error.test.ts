import { describe, expect, it, vi } from "vitest";
import httpStatus from "http-status";

// Mock config before importing utilities
vi.mock("../../src/config/env.config.js", () => ({
  default: { jwtSecret: "test-secret" },
}));

import { APIError } from "../../src/utils/index.js";

describe("APIError", () => {
  it("creates error with message and statusCode", () => {
    const error = new APIError("Unauthorized access", httpStatus.UNAUTHORIZED);

    expect(error.message).toBe("Unauthorized access");
    expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(error).toBeInstanceOf(Error);
  });

  it("extends Error and captures stackTrace", () => {
    const error = new APIError("Test error", 400);

    expect(error.stack).toBeDefined();
    expect(error.stack).toMatch(/Test error/);
  });
});
