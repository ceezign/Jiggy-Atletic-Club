import { z } from "zod";

const fitnessGoals = [
  "WEIGHT_LOSS",
  "MUSCLE_GAIN",
  "ENDURANCE",
  "GENERAL_FITNESS",
  "STRENGTH",
  "FLEXIBILITY",
  "REHABILITATION",
  "OTHER",
] as const;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(80),
    lastName: z.string().trim().min(1, "Last name is required").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email address"),
    phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
    dateOfBirth: z.coerce.date({ errorMap: () => ({ message: "Enter a valid date of birth" }) }),
    fitnessGoal: z.enum(fitnessGoals).optional(),
    emergencyContact: z.string().trim().max(200).optional().or(z.literal("")),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the Terms & Conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
