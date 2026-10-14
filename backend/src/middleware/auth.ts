import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "../utils/AppError";
import { prisma } from "../lib/prisma";

export const AUTH_COOKIE_NAME = "gym_session";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) {
      throw new AppError(401, "You must be logged in to do that.");
    }

    const payload = verifyToken(token);

    // Confirm the user still exists and is active on every request —
    // cheap check that prevents a deleted/deactivated account from
    // continuing to act on a still-valid token.
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, role: true },
    });

    if (!user || !user.isActive) {
      throw new AppError(401, "Your session is no longer valid. Please log in again.");
    }

    req.userId = payload.userId;
    req.userRole = user.role;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(401, "Invalid or expired session. Please log in again."));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.userRole !== "ADMIN") {
    return next(new AppError(403, "Admin access required."));
  }
  next();
}
