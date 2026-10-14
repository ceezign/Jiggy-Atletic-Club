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

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().min(6).max(30).optional(),
  dateOfBirth: z.coerce.date().optional(),
  fitnessGoal: z.enum(fitnessGoals).optional(),
  emergencyContact: z.string().trim().max(200).optional(),
  profilePhotoUrl: z.string().url().optional(),
});

export const bookClassSchema = z.object({
  classId: z.string().uuid("Invalid class id"),
  bookingDate: z.coerce.date(),
});

export const freeTrialSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  preferredDate: z.coerce.date({ errorMap: () => ({ message: "Choose a preferred date" }) }),
  preferredTime: z.string().trim().min(1, "Choose a preferred time"),
  preferredActivity: z.string().trim().min(1, "Choose an activity"),
  fitnessGoal: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(2000),
});
