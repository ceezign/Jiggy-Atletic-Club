"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api, ApiError } from "@/lib/api";
import { User } from "@/types";
import { useAuth } from "@/lib/auth-context";

const GOALS = ["WEIGHT_LOSS", "MUSCLE_GAIN", "ENDURANCE", "GENERAL_FITNESS", "STRENGTH", "FLEXIBILITY", "REHABILITATION", "OTHER"];

export default function ProfilePage() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    api.get<User>("/api/Members/profile").then((p) => {
      setProfile(p);
      reset({
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone || "",
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
        fitnessGoal: p.fitnessGoal || "",
        emergencyContact: p.emergencyContact || "",
      });
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaved(false);
    setServerError(null);
    try {
      const updated = await api.put<User>("/api/Members/profile", data);
      setProfile(updated);
      await refresh();
      setSaved(true);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Could not save changes.");
    }
  };

  if (loading) return <p className="text-muted">Loading profile...</p>;
  if (!profile) return <p className="text-muted">Could not load your profile.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">My Profile</h1>
      <p className="text-muted mt-2">Keep your details up to date.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 bg-surface border border-white/10 rounded-soft p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name"><input {...register("firstName")} className="input" /></Field>
          <Field label="Last name"><input {...register("lastName")} className="input" /></Field>
        </div>
        <Field label="Email (cannot be changed)">
          <input value={profile.email} disabled className="input opacity-60" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone"><input {...register("phone")} className="input" /></Field>
          <Field label="Date of birth"><input {...register("dateOfBirth")} type="date" className="input" /></Field>
        </div>
        <Field label="Fitness goal">
          <select {...register("fitnessGoal")} className="input">
            <option value="">Select a goal</option>
            {GOALS.map((g) => <option key={g} value={g}>{g.replace("_", " ")}</option>)}
          </select>
        </Field>
        <Field label="Emergency contact">
          <input {...register("emergencyContact")} className="input" />
        </Field>

        {saved && <p className="text-sm text-violet">Profile updated.</p>}
        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
