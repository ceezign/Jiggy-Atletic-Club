import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { freeTrialSchema } from "../validation/memberSchemas";
import { ok, created } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();

// POST /api/free-trial — open to visitors and members alike.
// If the request carries a valid session cookie, the booking is linked to that account.
router.post(
  "/",
  validateBody(freeTrialSchema),
  asyncHandler(async (req, res) => {
    const booking = await prisma.freeTrialBooking.create({
      data: {
        ...req.body,
        userId: req.userId ?? null,
      },
    });
    return created(res, booking);
  })
);

// GET /api/free-trial/me — member's own trial booking(s)
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const bookings = await prisma.freeTrialBooking.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return ok(res, bookings);
  })
);

// PATCH /api/free-trial/:id/cancel — member can cancel their own trial
router.patch(
  "/:id/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    const trial = await prisma.freeTrialBooking.findUnique({ where: { id: req.params.id } });
    if (!trial || trial.userId !== req.userId) {
      throw new AppError(404, "Trial booking not found.");
    }
    const updated = await prisma.freeTrialBooking.update({
      where: { id: trial.id },
      data: { status: "CANCELLED" },
    });
    return ok(res, updated);
  })
);

export default router;
