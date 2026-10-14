"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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
      const res = await api.post<{ user: User }>("/api/auth/login", data);
      await refresh();
      router.push(res.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-4xl lg:text-5xl text-ivory text-center">Welcome back</h1>
        <p className="text-muted text-center mt-3">Log in to book classes and track your progress.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className="input" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <input {...register("password")} type="password" className="input" />
          </Field>

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-volt">
              Forgot password?
            </Link>
          </div>

          {serverError && <p className="text-sm text-danger">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          New here?{" "}
          <Link href="/register" className="text-volt font-semibold hover:underline">Create an account</Link>
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
