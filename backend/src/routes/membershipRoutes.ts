import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { ok } from "../utils/apiResponse";

const router = Router();

// GET /api/memberships/plans — public pricing table
router.get(
  "/plans",
  asyncHandler(async (_req, res) => {
    const plans = await prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return ok(res, plans);
  })
);

// GET /api/memberships/me — the logged-in member's current membership
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const membership = await prisma.membership.findFirst({
      where: { userId: req.userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    return ok(res, membership);
  })
);

export default router;
