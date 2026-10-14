import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { ok } from "../utils/apiResponse";

const router = Router();
router.use(requireAuth);

// GET /api/dashboard/overview — the data behind the dashboard home screen
router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const userId = req.userId!;

    const [user, membership, upcomingBookings, recentWorkouts, attendanceCount] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { firstName: true, lastName: true },
        }),
        prisma.membership.findFirst({
          where: { userId },
          include: { plan: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.classBooking.findMany({
          where: { userId, status: "BOOKED", bookingDate: { gte: new Date() } },
          include: { class: { include: { activity: true, coach: true } } },
          orderBy: { bookingDate: "asc" },
          take: 5,
        }),
        prisma.workout.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          take: 5,
          include: { activity: true, coach: true },
        }),
        prisma.attendance.count({ where: { userId } }),
      ]);

    return ok(res, {
      welcomeName: user?.firstName ?? "there",
      membership,
      upcomingClasses: upcomingBookings,
      recentActivity: recentWorkouts,
      totalVisits: attendanceCount,
    });
  })
);

// GET /api/dashboard/classes — member's class bookings (upcoming + past)
router.get(
  "/classes",
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const [upcoming, past] = await Promise.all([
      prisma.classBooking.findMany({
        where: { userId, status: "BOOKED", bookingDate: { gte: new Date() } },
        include: { class: { include: { activity: true, coach: true } } },
        orderBy: { bookingDate: "asc" },
      }),
      prisma.classBooking.findMany({
        where: {
          userId,
          OR: [{ bookingDate: { lt: new Date() } }, { status: { in: ["CANCELLED", "ATTENDED", "NO_SHOW"] } }],
        },
        include: { class: { include: { activity: true, coach: true } } },
        orderBy: { bookingDate: "desc" },
        take: 20,
      }),
    ]);
    return ok(res, { upcoming, past });
  })
);

// GET /api/dashboard/attendance
router.get(
  "/attendance",
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const [totalVisits, recent, classesAttended] = await Promise.all([
      prisma.attendance.count({ where: { userId } }),
      prisma.attendance.findMany({
        where: { userId },
        orderBy: { visitDate: "desc" },
        take: 20,
      }),
      prisma.classBooking.count({ where: { userId, status: "ATTENDED" } }),
    ]);

    // Monthly rollup for the last 6 months, computed in JS to stay portable across DBs
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const all = await prisma.attendance.findMany({
      where: { userId, visitDate: { gte: sixMonthsAgo } },
      select: { visitDate: true },
    });
    const monthly: Record<string, number> = {};
    all.forEach((a) => {
      const key = `${a.visitDate.getFullYear()}-${String(a.visitDate.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] ?? 0) + 1;
    });

    return ok(res, { totalVisits, classesAttended, recent, monthly });
  })
);

// GET /api/dashboard/workouts — activity/workout history
router.get(
  "/workouts",
  asyncHandler(async (req, res) => {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.userId },
      include: { activity: true, coach: true },
      orderBy: { date: "desc" },
    });
    return ok(res, workouts);
  })
);

// GET /api/dashboard/progress
router.get(
  "/progress",
  asyncHandler(async (req, res) => {
    const entries = await prisma.progress.findMany({
      where: { userId: req.userId },
      orderBy: { recordedAt: "asc" },
    });
    const [workoutsCompleted, classesAttended] = await Promise.all([
      prisma.workout.count({ where: { userId: req.userId } }),
      prisma.classBooking.count({ where: { userId: req.userId, status: "ATTENDED" } }),
    ]);
    return ok(res, { entries, workoutsCompleted, classesAttended });
  })
);

export default router;
