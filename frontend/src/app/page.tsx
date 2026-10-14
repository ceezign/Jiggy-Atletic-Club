import Link from "next/link";
import { ArrowRight, Dumbbell, Users, CalendarClock, Target, TrendingUp, HeartHandshake } from "lucide-react";
import { api } from "@/lib/api";
import { Testimonial, MembershipPlan } from "@/types";
import FreeTrialForm from "@/components/FreeTrialForm";
import TestimonialCard from "@/components/TestimonialCard";
import PricingCard from "@/components/PricingCard";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await api.get<Testimonial[]>("/api/testimonials");
  } catch {
    return [];
  }
}

async function getPlans(): Promise<MembershipPlan[]> {
  try {
    return await api.get<MembershipPlan[]>("/api/Memberships/plans");
  } catch {
    return [];
  }
}

const STATS = [
  { value: "500+", label: "Active Members" },
  { value: "10+", label: "Professional Coaches" },
  { value: "20+", label: "Weekly Classes" },
  { value: "5+", label: "Years of Experience" },
];

const REASONS = [
  {
    icon: Users,
    title: "Professional Coaches",
    body: "Train with experienced and certified fitness professionals who know your name and your goals.",
    large: true,
  },
  {
    icon: Dumbbell,
    title: "Modern Equipment",
    body: "Access quality equipment for strength, cardio and functional training.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Membership",
    body: "Membership options designed for different fitness goals and schedules.",
  },
  {
    icon: HeartHandshake,
    title: "Supportive Community",
    body: "Train alongside people who motivate and encourage each other.",
  },
  {
    icon: Target,
    title: "Personalized Training",
    body: "Get guidance that matches your fitness level and goals.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    body: "Monitor your workouts, attendance and fitness journey from your Member dashboard.",
  },
];

export default async function HomePage() {
  const [testimonials, plans] = await Promise.all([getTestimonials(), getPlans()]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/images/hero.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />
        <div className="relative container-x pt-16 pb-20 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-ivory">
              BUILD YOUR <span className="text-volt">STRONGEST</span> SELF
            </h1>
            <p className="mt-6 text-lg text-ivory/80 max-w-xl leading-relaxed">
              Train smarter, get stronger, and become part of a community committed to helping you
              reach your fitness goals.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/free-trial"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors"
              >
                Book a Free Session <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/Membership"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-ivory font-semibold rounded-sharp hover:border-volt hover:text-volt transition-colors"
              >
                View Membership Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-charcoal/60 backdrop-blur">
          <div className="container-x grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="py-6 px-4 text-center lg:text-left">
                <div className="font-display text-3xl lg:text-4xl text-volt">{s.value}</div>
                <div className="text-xs lg:text-sm text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — bento grid, one large tile + five smaller */}
      <section className="container-x py-20 lg:py-28">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-4xl lg:text-5xl text-ivory">Why train at Jiggy</h2>
          <p className="mt-4 text-muted text-lg">
            Everything here is built around one outcome: helping you actually stick with training
            long enough to see results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className={`rounded-soft border border-white/10 bg-surface p-7 hover:border-volt/50 transition-colors ${
                  r.large ? "md:col-span-2 md:row-span-1" : ""
                }`}
              >
                <Icon className="w-7 h-7 text-violet mb-4" strokeWidth={1.75} />
                <h3 className="font-display text-xl text-ivory mb-2">{r.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{r.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MEMBERSHIP PREVIEW */}
      {plans.length > 0 && (
        <section className="bg-surface border-y border-white/10 py-20 lg:py-28">
          <div className="container-x">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-4xl lg:text-5xl text-ivory">Membership plans</h2>
                <p className="mt-3 text-muted text-lg max-w-lg">
                  Pick the level of support that matches where you are right now.
                </p>
              </div>
              <Link href="/Membership" className="text-sm font-semibold text-volt inline-flex items-center gap-1 hover:gap-2 transition-all">
                Compare all plans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FREE TRIAL CONVERSION SECTION */}
      <section className="container-x py-20 lg:py-28">
        <div className="rounded-soft border border-violet/30 bg-gradient-to-br from-surface to-surface-2 p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl text-ivory leading-tight">
              TRY YOUR FIRST SESSION FOR FREE
            </h2>
            <p className="mt-5 text-muted text-lg leading-relaxed">
              Experience our gym, meet our coaches and discover the right training program for
              your goals.
            </p>
          </div>
          <FreeTrialForm />
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="container-x py-20 lg:py-28">
          <h2 className="font-display text-4xl lg:text-5xl text-ivory mb-12">What our Members say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.slice(0, 4).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
