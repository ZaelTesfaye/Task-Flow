import { describe, expect, it, vi } from "vitest";
import httpStatus from "http-status";

import notFoundHandler from "../../src/middlewares/not-found.middleware.js";

describe("notFoundHandler", () => {
  it("returns 404 with a simple not found payload", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    notFoundHandler({} as any, res as any);

    expect(res.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({ message: "Not Found!" });
  });
});
