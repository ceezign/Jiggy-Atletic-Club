import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { contactMessageSchema } from "../validation/memberSchemas";
import { created } from "../utils/apiResponse";

const router = Router();

router.post(
  "/",
  validateBody(contactMessageSchema),
  asyncHandler(async (req, res) => {
    const message = await prisma.contactMessage.create({
      data: { ...req.body, userId: req.userId ?? null },
    });
    return created(res, message);
  })
);

export default router;
