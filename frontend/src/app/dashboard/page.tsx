"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Dumbbell, TrendingUp, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface OverviewData {
  welcomeName: string;
  Membership: { plan: { name: string }; status: string; expiryDate: string } | null;
  upcomingClasses: Array<{
    id: string;
    bookingDate: string;
    class: { name: string; startTime: string; activity: { name: string }; coach: { firstName: string; lastName: string } };
  }>;
  recentActivity: Array<{ id: string; title: string; date: string; durationMinutes: number }>;
  totalVisits: number;
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<OverviewData>("/api/dashboard/overview")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;
  if (!data) return <p className="text-muted">Could not load your dashboard right now.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">Welcome back, {data.welcomeName}</h1>
      <p className="text-muted mt-2">Here&apos;s where things stand.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <StatCard
          icon={CalendarCheck}
          label="Membership"
          value={data.Membership ? data.Membership.plan.name : "None"}
          sub={data.Membership ? data.Membership.status : "No active plan"}
        />
        <StatCard icon={Dumbbell} label="Total Visits" value={String(data.totalVisits)} sub="All time" />
        <StatCard
          icon={TrendingUp}
          label="Upcoming Classes"
          value={String(data.upcomingClasses.length)}
          sub="Booked this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <section className="bg-surface border border-white/10 rounded-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-ivory">Upcoming Classes</h2>
            <Link href="/dashboard/classes" className="text-xs text-volt font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {data.upcomingClasses.length === 0 ? (
            <p className="text-sm text-muted">
              No classes booked yet.{" "}
              <Link href="/classes" className="text-volt hover:underline">Browse the schedule</Link>.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.upcomingClasses.map((b) => (
                <li key={b.id} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0">
                  <div>
                    <p className="text-ivory font-medium">{b.class.name}</p>
                    <p className="text-muted text-xs mt-0.5">
                      Coach {b.class.coach.firstName} {b.class.coach.lastName}
                    </p>
                  </div>
                  <span className="text-violet text-xs">{b.class.startTime}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-surface border border-white/10 rounded-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-ivory">Recent Activity</h2>
            <Link href="/dashboard/workouts" className="text-xs text-volt font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-muted">No workouts logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((w) => (
                <li key={w.id} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0">
                  <p className="text-ivory font-medium">{w.title}</p>
                  <span className="text-muted text-xs">{w.durationMinutes} min</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="bg-surface border border-white/10 rounded-soft p-6">
      <Icon className="w-5 h-5 text-violet mb-3" />
      <p className="text-xs text-muted">{label}</p>
      <p className="font-display text-2xl text-ivory mt-1">{value}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </div>
  );
}
