"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { RESOURCES } from "@/lib/adminConfig";

interface Stats {
  members: number; coaches: number; activities: number; classes: number;
  pendingTrials: number; unreadMessages: number; bookings: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/api/admin/stats").then(setStats).catch(() => setStats(null));
  }, []);

  const cards = stats
    ? [
        { label: "Members", value: stats.members, href: "/admin/members" },
        { label: "Pending trial requests", value: stats.pendingTrials, href: "/admin/trials", highlight: stats.pendingTrials > 0 },
        { label: "Unread messages", value: stats.unreadMessages, href: "/admin/messages", highlight: stats.unreadMessages > 0 },
        { label: "Active class bookings", value: stats.bookings, href: "/admin/classes" },
        { label: "Classes", value: stats.classes, href: "/admin/classes" },
        { label: "Coaches", value: stats.coaches, href: "/admin/coaches" },
        { label: "Activities", value: stats.activities, href: "/admin/activities" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl lg:text-4xl text-ivory">Admin Overview</h1>
      <p className="text-muted mt-2">Manage everything visitors and members see on the website.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-soft border p-5 transition-colors hover:border-volt/60 ${c.highlight ? "border-volt bg-surface-2" : "border-white/10 bg-surface"}`}
          >
            <p className="text-xs text-muted">{c.label}</p>
            <p className="font-display text-3xl text-ivory mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-xl text-ivory mt-12 mb-4">Manage content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <Link key={r.key} href={`/admin/${r.key}`} className="rounded-soft border border-white/10 bg-surface p-5 hover:border-volt/60 transition-colors">
            <h3 className="font-display text-lg text-ivory">{r.title}</h3>
            <p className="text-sm text-muted mt-1">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
