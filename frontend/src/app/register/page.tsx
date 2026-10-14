"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(6, "Enter a valid phone number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await api.post("/api/auth/register", data);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-4xl lg:text-5xl text-ivory text-center">Create your account</h1>
        <p className="text-muted text-center mt-3">Start your free trial and track your progress from day one.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" error={errors.firstName?.message}>
              <input {...register("firstName")} className="input" />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <input {...register("lastName")} className="input" />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} className="input" />
            </Field>
            <Field label="Date of birth" error={errors.dateOfBirth?.message}>
              <input {...register("dateOfBirth")} type="date" className="input" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Password" error={errors.password?.message}>
              <input {...register("password")} type="password" className="input" />
            </Field>
            <Field label="Confirm password" error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" className="input" />
            </Field>
          </div>

          <label className="flex items-start gap-2 text-sm text-muted pt-1">
            <input type="checkbox" {...register("acceptTerms")} className="mt-1" />
            I agree to the Terms & Conditions and Privacy Policy.
          </label>
          {errors.acceptTerms && <p className="text-xs text-danger">{errors.acceptTerms.message}</p>}

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already a Member?{" "}
          <Link href="/login" className="text-volt font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}
