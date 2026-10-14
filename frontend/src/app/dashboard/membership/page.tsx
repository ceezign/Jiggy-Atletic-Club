"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Membership } from "@/types";

export default function DashboardMembershipPage() {
  const [Membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Membership | null>("/api/Memberships/me").then(setMembership).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading Membership...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">My Membership</h1>

      {!Membership ? (
        <div className="mt-8 bg-surface border border-white/10 rounded-soft p-8 text-center">
          <p className="text-muted mb-5">You don&apos;t have an active Membership plan yet.</p>
          <Link href="/Membership" className="inline-flex px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors">
            View Plans
          </Link>
        </div>
      ) : (
        <div className="mt-8 bg-surface border border-white/10 rounded-soft p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ivory">{Membership.plan.name}</h2>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-sharp ${
                Membership.status === "ACTIVE" ? "bg-violet/20 text-violet" : "bg-danger/20 text-danger"
              }`}
            >
              {Membership.status}
            </span>
          </div>
          <p className="text-muted text-sm mt-2">${Membership.plan.monthlyPrice}/month</p>
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-xs text-muted">Start Date</p>
              <p className="text-ivory">{new Date(Membership.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Renews / Expires</p>
              <p className="text-ivory">{new Date(Membership.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-ivory/85">
            {Membership.plan.features.map((f) => <li key={f}>· {f}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
