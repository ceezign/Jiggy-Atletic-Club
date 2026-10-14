"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

interface Booking {
  id: string;
  bookingDate: string;
  status: string;
  class: { name: string; startTime: string; endTime: string; activity: { name: string }; coach: { firstName: string; lastName: string } };
}

export default function DashboardClassesPage() {
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ upcoming: Booking[]; past: Booking[] }>("/api/dashboard/classes")
      .then((d) => {
        setUpcoming(d.upcoming);
        setPast(d.past);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancelBooking = async (id: string) => {
    setMessage(null);
    try {
      await api.patch(`/api/classes/bookings/${id}/cancel`);
      setMessage("Booking cancelled.");
      load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not cancel this booking.");
    }
  };

  if (loading) return <p className="text-muted">Loading your classes...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl lg:text-4xl text-ivory">My Classes</h1>
        <Link href="/classes" className="text-sm font-semibold text-volt hover:underline">Book a class</Link>
      </div>

      {message && <p className="mt-4 text-sm text-violet">{message}</p>}

      <h2 className="font-display text-xl text-ivory mt-8 mb-3">Upcoming</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted">No upcoming classes booked.</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((b) => (
            <div key={b.id} className="flex items-center justify-between bg-surface border border-white/10 rounded-soft p-5">
              <div>
                <p className="text-ivory font-medium">{b.class.name}</p>
                <p className="text-xs text-muted mt-1">
                  {new Date(b.bookingDate).toLocaleDateString()} · {b.class.startTime}–{b.class.endTime} · Coach {b.class.coach.firstName}
                </p>
              </div>
              <button
                onClick={() => cancelBooking(b.id)}
                className="text-xs font-semibold text-danger hover:underline"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-ivory mt-10 mb-3">Past & Cancelled</h2>
      {past.length === 0 ? (
        <p className="text-sm text-muted">No class history yet.</p>
      ) : (
        <div className="space-y-3">
          {past.map((b) => (
            <div key={b.id} className="flex items-center justify-between bg-surface/60 border border-white/5 rounded-soft p-5">
              <div>
                <p className="text-ivory/70 font-medium">{b.class.name}</p>
                <p className="text-xs text-muted mt-1">{new Date(b.bookingDate).toLocaleDateString()}</p>
              </div>
              <span className="text-xs text-muted">{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
