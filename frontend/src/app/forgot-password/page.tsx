"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await api.post("/api/auth/forgot-password", data);
      setSent(true);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-4xl text-ivory text-center">Reset your password</h1>
        {sent ? (
          <div className="mt-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-violet mx-auto mb-4" />
            <p className="text-muted">
              If an account exists for that email, a reset link is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
            <label className="block">
              <span className="block text-xs font-medium text-muted mb-1.5">Email</span>
              <input {...register("email")} type="email" className="input" />
              {errors.email && <span className="block text-xs text-danger mt-1">{errors.email.message}</span>}
            </label>
            {serverError && <p className="text-sm text-danger">{serverError}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
