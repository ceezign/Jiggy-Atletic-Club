import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { bookClassSchema } from "../validation/memberSchemas";
import { ok, created } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();

// GET /api/classes — full weekly schedule, grouped implicitly by dayOfWeek via query
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { day } = req.query as { day?: string };
    const classes = await prisma.class.findMany({
      where: { isActive: true, ...(day ? { dayOfWeek: day as any } : {}) },
      include: {
        coach: { select: { id: true, firstName: true, lastName: true, photoUrl: true } },
        activity: { select: { id: true, name: true, slug: true } },
        bookings: { where: { status: "BOOKED" }, select: { id: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    const withAvailability = classes.map((c) => ({
      ...c,
      spacesAvailable: c.capacity - c.bookings.length,
      bookings: undefined,
    }));

    return ok(res, withAvailability);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const cls = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: {
        coach: true,
        activity: true,
        bookings: { where: { status: "BOOKED" }, select: { id: true } },
      },
    });
    if (!cls || !cls.isActive) throw new AppError(404, "Class not found.");
    return ok(res, {
      ...cls,
      spacesAvailable: cls.capacity - cls.bookings.length,
      bookings: undefined,
    });
  })
);

// POST /api/classes/book — member-only
router.post(
  "/book",
  requireAuth,
  validateBody(bookClassSchema),
  asyncHandler(async (req, res) => {
    const { classId, bookingDate } = req.body as { classId: string; bookingDate: Date };

    const cls = await prisma.class.findUnique({
      where: { id: classId },
      include: { bookings: { where: { status: "BOOKED" } } },
    });
    if (!cls || !cls.isActive) throw new AppError(404, "Class not found.");

    if (cls.bookings.length >= cls.capacity) {
      throw new AppError(409, "This class is fully booked.");
    }

    const existing = await prisma.classBooking.findUnique({
      where: {
        userId_classId_bookingDate: {
          userId: req.userId!,
          classId,
          bookingDate,
        },
      },
    });
    if (existing && existing.status === "BOOKED") {
      throw new AppError(409, "You already have a booking for this class.");
    }

    const booking = existing
      ? await prisma.classBooking.update({
          where: { id: existing.id },
          data: { status: "BOOKED" },
        })
      : await prisma.classBooking.create({
          data: { userId: req.userId!, classId, bookingDate, status: "BOOKED" },
        });

    return created(res, booking);
  })
);

// PATCH /api/classes/bookings/:id/cancel — member-only
router.patch(
  "/bookings/:id/cancel",
  requireAuth,
  asyncHandler(async (req, res) => {
    const booking = await prisma.classBooking.findUnique({ where: { id: req.params.id } });
    if (!booking || booking.userId !== req.userId) {
      throw new AppError(404, "Booking not found.");
    }
    const updated = await prisma.classBooking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });
    return ok(res, updated);
  })
);

export default router;
