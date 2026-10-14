import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Activity } from "@/types";

export const metadata = { title: "Activities" };

async function getActivities(): Promise<Activity[]> {
  try {
    return await api.get<Activity[]>("/api/activities");
  } catch {
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Activities</h1>
        <p className="mt-4 text-lg text-muted">
          From heavy barbell work to boxing pads, find the training style that fits your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((a) => (
          <Link
            key={a.id}
            href={`/activities/${a.slug}`}
            className="group rounded-soft border border-white/10 bg-surface overflow-hidden hover:border-volt/50 transition-colors"
          >
            <div
              className="h-44 bg-cover bg-center bg-surface-2"
              style={{ backgroundImage: `url(${a.imageUrl})` }}
            />
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-violet mb-2">
                <Clock className="w-3.5 h-3.5" /> {a.typicalDurationMinutes} min · {a.difficultyLevel.replace("_", " ")}
              </div>
              <h3 className="font-display text-xl text-ivory mb-2">{a.name}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-2">{a.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-volt group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {activities.length === 0 && (
        <p className="text-muted">
          Activities couldn&apos;t be loaded right now. Please check back shortly.
        </p>
      )}
    </div>
  );
}
