"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "@/lib/api";

interface AttendanceData {
  totalVisits: number;
  classesAttended: number;
  recent: Array<{ id: string; visitDate: string }>;
  monthly: Record<string, number>;
}

export default function AttendancePage() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AttendanceData>("/api/dashboard/attendance").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading attendance...</p>;
  if (!data) return <p className="text-muted">Could not load attendance data.</p>;

  const chartData = Object.entries(data.monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, visits: count }));

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">Attendance</h1>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-surface border border-white/10 rounded-soft p-6">
          <p className="text-xs text-muted">Total Visits</p>
          <p className="font-display text-3xl text-ivory mt-1">{data.totalVisits}</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-soft p-6">
          <p className="text-xs text-muted">Classes Attended</p>
          <p className="font-display text-3xl text-ivory mt-1">{data.classesAttended}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-surface border border-white/10 rounded-soft p-6 mt-6">
          <h2 className="font-display text-lg text-ivory mb-4">Visits by Month</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#A39FB5" fontSize={12} />
              <YAxis stroke="#A39FB5" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#16141D", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Bar dataKey="visits" fill="#D4F23A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h2 className="font-display text-xl text-ivory mt-10 mb-3">Recent Visits</h2>
      {data.recent.length === 0 ? (
        <p className="text-sm text-muted">No visits recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {data.recent.map((v) => (
            <li key={v.id} className="text-sm text-ivory/85 border-b border-white/5 pb-2">
              {new Date(v.visitDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
