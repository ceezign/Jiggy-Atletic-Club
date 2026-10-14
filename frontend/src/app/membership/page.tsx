import { api } from "@/lib/api";
import { MembershipPlan } from "@/types";
import PricingCard from "@/components/PricingCard";

export const metadata = { title: "Membership Plans" };

async function getPlans(): Promise<MembershipPlan[]> {
  try {
    return await api.get<MembershipPlan[]>("/api/Memberships/plans");
  } catch {
    return [];
  }
}

export default async function MembershipPage() {
  const plans = await getPlans();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Membership Plans</h1>
        <p className="mt-4 text-lg text-muted">
          Every plan includes full gym access. Higher tiers add coaching, tracking, and more
          personal support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-muted">Plans couldn&apos;t be loaded right now. Please check back shortly.</p>
      )}
    </div>
  );
}
