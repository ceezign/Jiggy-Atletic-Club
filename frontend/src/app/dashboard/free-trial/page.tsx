"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface TrialBooking {
  id: string;
  preferredDate: string;
  preferredTime: string;
  preferredActivity: string;
  status: string;
}

export default function DashboardFreeTrialPage() {
  const [bookings, setBookings] = useState<TrialBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<TrialBooking[]>("/api/free-trial/me").then(setBookings).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl lg:text-4xl text-ivory">Free Trial Bookings</h1>
        <Link href="/free-trial" className="text-sm font-semibold text-volt hover:underline">Book another</Link>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 text-sm text-muted">You haven&apos;t booked a free trial session yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between bg-surface border border-white/10 rounded-soft p-5">
              <div>
                <p className="text-ivory font-medium">{b.preferredActivity}</p>
                <p className="text-xs text-muted mt-1">
                  {new Date(b.preferredDate).toLocaleDateString()} · {b.preferredTime}
                </p>
              </div>
              <span className="text-xs font-semibold text-violet">{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
