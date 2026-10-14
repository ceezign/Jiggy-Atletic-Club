"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "@/lib/api";

interface ProgressEntry {
  id: string;
  recordedAt: string;
  weightKg: number | null;
  bodyFatPercentage: number | null;
  goalNote: string | null;
}

interface ProgressData {
  entries: ProgressEntry[];
  workoutsCompleted: number;
  classesAttended: number;
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ProgressData>("/api/dashboard/progress").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading progress...</p>;
  if (!data) return <p className="text-muted">Could not load your progress.</p>;

  const chartData = data.entries
    .filter((e) => e.weightKg != null)
    .map((e) => ({ date: new Date(e.recordedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), weight: e.weightKg }));

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">My Progress</h1>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-surface border border-white/10 rounded-soft p-6">
          <p className="text-xs text-muted">Workouts Completed</p>
          <p className="font-display text-3xl text-ivory mt-1">{data.workoutsCompleted}</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-soft p-6">
          <p className="text-xs text-muted">Classes Attended</p>
          <p className="font-display text-3xl text-ivory mt-1">{data.classesAttended}</p>
        </div>
      </div>

      {chartData.length > 1 ? (
        <div className="bg-surface border border-white/10 rounded-soft p-6 mt-6">
          <h2 className="font-display text-lg text-ivory mb-4">Weight Trend (kg)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#A39FB5" fontSize={12} />
              <YAxis stroke="#A39FB5" fontSize={12} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#16141D", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Line type="monotone" dataKey="weight" stroke="#A78BFA" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted">
          Not enough data yet to chart your progress. Your coach will log measurements as you train
          together.
        </p>
      )}

      {data.entries.some((e) => e.goalNote) && (
        <div className="mt-8">
          <h2 className="font-display text-xl text-ivory mb-3">Coach Notes</h2>
          <ul className="space-y-2">
            {data.entries.filter((e) => e.goalNote).map((e) => (
              <li key={e.id} className="text-sm text-ivory/85 bg-surface border border-white/10 rounded-soft p-4">
                {e.goalNote}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
