"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { GymClass } from "@/types";
import { useAuth } from "@/lib/auth-context";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABELS: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

export default function ScheduleTable() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [activeDay, setActiveDay] = useState("MONDAY");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api
      .get<GymClass[]>(`/api/classes?day=${activeDay}`)
      .then(setClasses)
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, [activeDay]);

  const handleBook = async (classId: string) => {
    if (!user) {
      setMessage({ type: "error", text: "Please log in to book a class." });
      return;
    }
    setMessage(null);
    try {
      const nextDate = getNextDateForDay(activeDay);
      await api.post("/api/classes/book", { classId, bookingDate: nextDate });
      setMessage({ type: "success", text: "Class booked! Check your dashboard for details." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Could not book this class." });
    }
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto scroll-thin pb-2 mb-8">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 text-sm font-semibold rounded-sharp whitespace-nowrap transition-colors ${
              activeDay === day ? "bg-volt text-charcoal" : "bg-surface border border-white/10 text-ivory/80 hover:border-volt/50"
            }`}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-sharp text-sm ${message.type === "success" ? "bg-violet/15 text-violet" : "bg-danger/15 text-danger"}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading schedule...</p>
      ) : classes.length === 0 ? (
        <p className="text-muted">No classes scheduled for this day yet.</p>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-soft border border-white/10 bg-surface p-5"
            >
              <div className="flex items-center gap-5">
                <div className="text-center w-20 shrink-0">
                  <div className="font-display text-lg text-volt">{c.startTime}</div>
                  <div className="text-xs text-muted">{c.endTime}</div>
                </div>
                <div>
                  <h3 className="font-display text-lg text-ivory">{c.name}</h3>
                  <p className="text-sm text-muted">
                    {c.activity.name} · Coach {c.coach.firstName} {c.coach.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:pl-5">
                <span className={`text-xs font-medium ${c.spacesAvailable <= 0 ? "text-danger" : "text-muted"}`}>
                  {c.spacesAvailable <= 0 ? "Full" : `${c.spacesAvailable} spaces left`}
                </span>
                <button
                  onClick={() => handleBook(c.id)}
                  disabled={c.spacesAvailable <= 0}
                  className="px-4 py-2 text-sm font-semibold rounded-sharp bg-volt text-charcoal hover:bg-volt-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <p className="mt-8 text-sm text-muted">
          <Link href="/login" className="text-volt font-semibold hover:underline">Log in</Link> or{" "}
          <Link href="/register" className="text-volt font-semibold hover:underline">create an account</Link> to book a class.
        </p>
      )}
    </div>
  );
}

function getNextDateForDay(dayName: string): string {
  const dayIndex = DAYS.indexOf(dayName); // 0 = Monday
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // convert Sun=0 to Mon=0 based index
  let diff = dayIndex - todayIndex;
  if (diff < 0) diff += 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return target.toISOString().split("T")[0];
}
