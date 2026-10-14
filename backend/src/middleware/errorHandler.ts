import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { fail } from "../utils/apiResponse";

export function notFoundHandler(req: Request, res: Response) {
  fail(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Known, intentional application errors
  if (err instanceof AppError) {
    return fail(res, err.status, err.message, err.details);
  }

  // Request validation errors (zod)
  if (err instanceof ZodError) {
    return fail(res, 400, "Validation failed", err.flatten());
  }

  // Prisma known errors (unique constraint, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return fail(res, 409, "A record with this value already exists.", {
        fields: err.meta?.target,
      });
    }
    if (err.code === "P2003") {
      return fail(res, 409, "This item is used elsewhere and can't be deleted. Deactivate it instead.");
    }
    if (err.code === "P2025") {
      return fail(res, 404, "Record not found.");
    }
    return fail(res, 400, "Database request error.");
  }

  // Anything unexpected — never leak internals to the client
  console.error("Unhandled error:", err);
  return fail(res, 500, "Something went wrong. Please try again.");
}
