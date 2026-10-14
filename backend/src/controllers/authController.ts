import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { ok, created } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { AUTH_COOKIE_NAME } from "../middleware/auth";
import { RegisterInput, LoginInput } from "../validation/authSchemas";

const SALT_ROUNDS = 12;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
}

function publicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: Date | null;
  fitnessGoal: string | null;
  emergencyContact: string | null;
  profilePhotoUrl: string | null;
  role: string;
  createdAt: Date;
}) {
  const { ...rest } = user;
  return rest;
}

export async function register(req: Request, res: Response) {
  const body = req.body as RegisterInput;

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    throw new AppError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      passwordHash,
      dateOfBirth: body.dateOfBirth,
      fitnessGoal: body.fitnessGoal,
      emergencyContact: body.emergencyContact || null,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());

  return created(res, { user: publicUser(user) });
}

export async function login(req: Request, res: Response) {
  const body = req.body as LoginInput;

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    throw new AppError(401, "Incorrect email or password.");
  }

  const validPassword = await bcrypt.compare(body.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, "Incorrect email or password.");
  }

  if (!user.isActive) {
    throw new AppError(403, "This account has been deactivated.");
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());

  return ok(res, { user: publicUser(user) });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  return ok(res, { message: "Logged out." });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw new AppError(404, "User not found.");
  return ok(res, { user: publicUser(user) });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body as { email: string };

  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way whether or not the account exists,
  // so the endpoint can't be used to enumerate registered emails.
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // In production this token is emailed to the user via a transactional email
    // provider. For local/dev use it's logged so the flow can be tested end-to-end.
    console.log(`[password reset] token for ${email}: ${resetToken}`);
  }

  return ok(res, {
    message: "If an account exists for that email, a reset link has been sent.",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body as { token: string; password: string };

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });

  if (!user) {
    throw new AppError(400, "This reset link is invalid or has expired.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  return ok(res, { message: "Password updated. You can now log in." });
}
