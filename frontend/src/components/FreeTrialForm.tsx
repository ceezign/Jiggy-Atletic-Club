"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Activity } from "@/types";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  preferredDate: z.string().min(1, "Choose a date"),
  preferredTime: z.string().min(1, "Choose a time"),
  preferredActivity: z.string().min(1, "Choose an activity"),
  fitnessGoal: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const TIME_SLOTS = ["07:00 AM", "09:00 AM", "12:00 PM", "05:00 PM", "07:00 PM"];

export default function FreeTrialForm() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api.get<Activity[]>("/api/activities").then(setActivities).catch(() => setActivities([]));
  }, []);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await api.post("/api/free-trial", data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-soft bg-charcoal border border-violet/30 p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-violet mx-auto mb-4" />
        <h3 className="font-display text-2xl text-ivory mb-2">You&apos;re booked in</h3>
        <p className="text-muted text-sm">
          We&apos;ve received your request and will confirm your session by email shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-semibold text-volt hover:underline"
        >
          Book another session
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-charcoal rounded-soft border border-white/10 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.fullName?.message}>
          <input {...register("fullName")} className="input" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" placeholder="jane@example.com" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className="input" placeholder="+234 800 000 0000" />
        </Field>
        <Field label="Preferred date" error={errors.preferredDate?.message}>
          <input {...register("preferredDate")} type="date" className="input" />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Preferred time" error={errors.preferredTime?.message}>
          <select {...register("preferredTime")} className="input">
            <option value="">Select a time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Activity" error={errors.preferredActivity?.message}>
          <select {...register("preferredActivity")} className="input">
            <option value="">Select an activity</option>
            {activities.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Fitness goal (optional)">
        <input {...register("fitnessGoal")} className="input" placeholder="e.g. Build muscle" />
      </Field>
      <Field label="Anything we should know? (optional)">
        <textarea {...register("message")} rows={3} className="input resize-none" />
      </Field>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Booking..." : "Book My Free Session"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}
