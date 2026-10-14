import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { ok } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return ok(res, activities);
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const activity = await prisma.activity.findUnique({
      where: { slug: req.params.slug },
    });
    if (!activity || !activity.isActive) {
      throw new AppError(404, "Activity not found.");
    }
    return ok(res, activity);
  })
);

export default router;
