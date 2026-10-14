"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Workout {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  notes: string | null;
  activity: { name: string } | null;
  coach: { firstName: string; lastName: string } | null;
}

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Workout[]>("/api/dashboard/workouts").then(setWorkouts).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading workout history...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">Workout History</h1>
      <p className="text-muted mt-2">A log of every session your coaches have recorded for you.</p>

      {workouts.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No workouts logged yet. Your coach will add sessions here as you train together.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {workouts.map((w) => (
            <div key={w.id} className="bg-surface border border-white/10 rounded-soft p-5">
              <div className="flex items-center justify-between">
                <p className="text-ivory font-medium">{w.title}</p>
                <span className="text-xs text-muted">{new Date(w.date).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-muted mt-1">
                {w.activity?.name || "General"} · {w.durationMinutes} min
                {w.coach ? ` · Coach ${w.coach.firstName} ${w.coach.lastName}` : ""}
              </p>
              {w.notes && <p className="text-sm text-ivory/80 mt-2">{w.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
