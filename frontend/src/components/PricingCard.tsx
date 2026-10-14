import Link from "next/link";
import { Check } from "lucide-react";
import { MembershipPlan } from "@/types";

export default function PricingCard({ plan }: { plan: MembershipPlan }) {
  return (
    <div
      className={`relative rounded-soft p-6 flex flex-col h-full border ${
        plan.isRecommended
          ? "border-volt bg-surface-2"
          : "border-white/10 bg-surface"
      }`}
    >
      {plan.isRecommended && (
        <span className="absolute -top-3 left-6 px-3 py-1 bg-volt text-charcoal text-xs font-bold rounded-sharp">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-2xl text-ivory">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-4xl text-ivory">${plan.monthlyPrice}</span>
        <span className="text-sm text-muted">/month</span>
      </div>
      <ul className="mt-6 space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ivory/85">
            <Check className="w-4 h-4 text-violet mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className={`mt-7 text-center px-4 py-3 rounded-sharp text-sm font-semibold transition-colors ${
          plan.isRecommended
            ? "bg-volt text-charcoal hover:bg-volt-bright"
            : "border border-white/25 text-ivory hover:border-volt hover:text-volt"
        }`}
      >
        Choose {plan.name}
      </Link>
    </div>
  );
}
