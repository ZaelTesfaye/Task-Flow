import { describe, expect, it, vi } from "vitest";

import asyncWrapper from "../../src/utils/asyncWrapper.js";

describe("asyncWrapper", () => {
  it("passes thrown errors to next", async () => {
    const error = new Error("boom");
    const next = vi.fn();

    const wrapped = asyncWrapper(async () => {
      throw error;
    });

    await wrapped({} as never, {} as never, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
