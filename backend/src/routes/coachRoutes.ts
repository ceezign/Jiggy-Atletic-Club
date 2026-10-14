import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { ok } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const coaches = await prisma.coach.findMany({
      where: { isActive: true },
      orderBy: { firstName: "asc" },
    });
    return ok(res, coaches);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const coach = await prisma.coach.findUnique({ where: { id: req.params.id } });
    if (!coach || !coach.isActive) {
      throw new AppError(404, "Coach not found.");
    }
    return ok(res, coach);
  })
);

export default router;
