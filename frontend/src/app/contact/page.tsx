"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await api.post("/api/contact", data);
      setSent(true);
      reset();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Could not send your message.");
    }
  };

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div>
          <h1 className="font-display text-5xl lg:text-6xl text-ivory">Get in touch</h1>
          <p className="mt-5 text-lg text-muted leading-relaxed max-w-md">
            Questions about Membership, classes, or anything else — reach out and we&apos;ll get
            back to you within a day.
          </p>
          <ul className="mt-9 space-y-4 text-sm text-ivory/85">
            <li className="flex gap-3"><MapPin className="w-5 h-5 text-violet shrink-0" /> 128 Ironworks Ave, Lagos</li>
            <li className="flex gap-3"><Phone className="w-5 h-5 text-violet shrink-0" /> +234 800 123 4567</li>
            <li className="flex gap-3"><Mail className="w-5 h-5 text-violet shrink-0" /> hello@jiggyathletic.club</li>
          </ul>
        </div>

        <div className="bg-surface border border-white/10 rounded-soft p-8">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-violet mx-auto mb-4" />
              <h3 className="font-display text-2xl text-ivory mb-2">Message sent</h3>
              <p className="text-muted text-sm">We&apos;ll be in touch shortly.</p>
              <button onClick={() => setSent(false)} className="mt-5 text-sm font-semibold text-volt hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register("name")} className="input" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input {...register("email")} type="email" className="input" />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <input {...register("phone")} className="input" />
              </Field>
              <Field label="Subject" error={errors.subject?.message}>
                <input {...register("subject")} className="input" />
              </Field>
              <Field label="Message" error={errors.message?.message}>
                <textarea {...register("message")} rows={5} className="input resize-none" />
              </Field>
              {serverError && <p className="text-sm text-danger">{serverError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
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
