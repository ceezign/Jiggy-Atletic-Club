"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-muted">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await api.post("/api/auth/reset-password", { ...data, token });
      router.push("/login");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Could not reset password.");
    }
  };

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-4xl text-ivory text-center">Set a new password</h1>
        {!token && (
          <p className="mt-6 text-sm text-danger text-center">
            This link is missing its reset token. Please use the link from your email.
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1.5">New password</span>
            <input {...register("password")} type="password" className="input" />
            {errors.password && <span className="block text-xs text-danger mt-1">{errors.password.message}</span>}
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1.5">Confirm password</span>
            <input {...register("confirmPassword")} type="password" className="input" />
            {errors.confirmPassword && <span className="block text-xs text-danger mt-1">{errors.confirmPassword.message}</span>}
          </label>
          {serverError && <p className="text-sm text-danger">{serverError}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
