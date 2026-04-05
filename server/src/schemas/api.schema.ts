import { z } from "../lib/zod-openapi.js";

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string().openapi({ example: "Operation successful" }),
    data: dataSchema.optional(),
  });

export const ApiErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: "An error occurred" }),
  })
  .openapi("ApiErrorResponse");
