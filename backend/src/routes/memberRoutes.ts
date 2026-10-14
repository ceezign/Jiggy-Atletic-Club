import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { updateProfileSchema } from "../validation/memberSchemas";
import { ok } from "../utils/apiResponse";

const router = Router();
router.use(requireAuth);

router.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        fitnessGoal: true,
        emergencyContact: true,
        profilePhotoUrl: true,
        createdAt: true,
      },
    });
    return ok(res, user);
  })
);

router.put(
  "/profile",
  validateBody(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: req.body,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        fitnessGoal: true,
        emergencyContact: true,
        profilePhotoUrl: true,
      },
    });
    return ok(res, user);
  })
);

export default router;
