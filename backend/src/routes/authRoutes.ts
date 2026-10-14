import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/authSchemas";

const router = Router();

// Stricter limiter on auth endpoints to slow down credential stuffing / brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: "Too many attempts. Please try again later." } },
});

router.post("/register", authLimiter, validateBody(registerSchema), asyncHandler(authController.register));
router.post("/login", authLimiter, validateBody(loginSchema), asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", requireAuth, asyncHandler(authController.me));
router.post(
  "/forgot-password",
  authLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);
router.post(
  "/reset-password",
  authLimiter,
  validateBody(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

export default router;
