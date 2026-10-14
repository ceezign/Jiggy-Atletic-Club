import { Response } from "express";

// Consistent response envelope used across every endpoint in the API.

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created<T>(res: Response, data: T) {
  return ok(res, data, 201);
}

export function noContent(res: Response) {
  return res.status(204).send();
}

export function fail(
  res: Response,
  status: number,
  message: string,
  details?: unknown
) {
  return res.status(status).json({
    success: false,
    error: { message, ...(details ? { details } : {}) },
  });
}
